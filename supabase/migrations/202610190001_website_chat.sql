-- Owner applies manually after staging verification. No model or scheduler is installed.
begin;
create schema if not exists wuus_private;
revoke all on schema wuus_private from public, anon, authenticated;
create table if not exists public.wuus_chat_conversations (
  id uuid primary key default gen_random_uuid(),
  version integer not null default 0 check (version >= 0),
  status text not null default 'waiting' check (status in ('waiting','replied')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists wuus_private.chat_sessions (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  conversation_id uuid not null unique references public.wuus_chat_conversations(id),
  expires_at timestamptz not null default now() + interval '7 days'
);
create table if not exists public.wuus_chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.wuus_chat_conversations(id),
  request_id uuid not null,
  role text not null check (role in ('visitor','team')),
  body text not null check (length(body) between 1 and 2000),
  reply_to uuid references public.wuus_chat_messages(id),
  request_version integer, consent_version text,
  created_at timestamptz not null default clock_timestamp(),
  unique(conversation_id, request_id)
);
create index if not exists wuus_chat_updated on public.wuus_chat_conversations(updated_at desc,id);
create index if not exists wuus_chat_thread on public.wuus_chat_messages(conversation_id,created_at,id);
create table if not exists wuus_private.chat_rate_limits (
  bucket_key text primary key, window_start timestamptz not null, requests integer not null
);
alter table public.wuus_chat_conversations enable row level security;
alter table public.wuus_chat_messages enable row level security;
revoke all on public.wuus_chat_conversations, public.wuus_chat_messages, wuus_private.chat_sessions, wuus_private.chat_rate_limits from public, anon, authenticated;
grant select on public.wuus_chat_conversations, public.wuus_chat_messages to service_role;

create or replace function wuus_private.chat_allow(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare bucket wuus_private.chat_rate_limits%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_key, 801));
  select * into bucket from wuus_private.chat_rate_limits where bucket_key = p_key;
  if not found or bucket.window_start <= now() - make_interval(secs => p_seconds) then
    insert into wuus_private.chat_rate_limits values (p_key,now(),1)
      on conflict (bucket_key) do update set window_start = excluded.window_start, requests = 1;
    return true;
  end if;
  if bucket.requests >= p_limit then return false; end if;
  update wuus_private.chat_rate_limits set requests = requests + 1 where bucket_key = p_key;
  return true;
end $$;

create or replace function public.wuus_chat_readiness()
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('ready',true,'schemaVersion','2026-10-19');
$$;

create or replace function public.admin_read_wuus_chat(p_conversation_id uuid)
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('conversation',to_jsonb(c), 'messages', coalesce((
    select jsonb_agg(jsonb_build_object('id',m.id,'role',m.role,'body',m.body,'created_at',m.created_at,'reply_to',m.reply_to) order by m.created_at,m.id)
    from public.wuus_chat_messages m where m.conversation_id=c.id
  ),'[]'::jsonb)) from public.wuus_chat_conversations c where c.id = p_conversation_id;
$$;

create or replace function public.create_wuus_chat(p_token_hash text, p_network_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare thread_id uuid;
begin
  if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' or p_network_key is null or p_network_key !~ '^[a-f0-9]{64}$' then raise exception 'Invalid input'; end if;
  if not wuus_private.chat_allow('session:'||p_network_key,10,3600) then return jsonb_build_object('outcome','limited'); end if;
  insert into public.wuus_chat_conversations default values returning id into thread_id;
  insert into wuus_private.chat_sessions(token_hash,conversation_id) values (p_token_hash,thread_id);
  return public.admin_read_wuus_chat(thread_id) || jsonb_build_object('outcome','ok');
end $$;

create or replace function public.read_wuus_chat(p_token_hash text, p_network_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare thread_id uuid;
begin
  if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' or p_network_key is null or p_network_key !~ '^[a-f0-9]{64}$' then raise exception 'Invalid input'; end if;
  if not wuus_private.chat_allow('read:'||p_network_key,180,60) then return jsonb_build_object('outcome','limited'); end if;
  select conversation_id into thread_id from wuus_private.chat_sessions where token_hash=p_token_hash and expires_at>now();
  if thread_id is null then return jsonb_build_object('outcome','expired'); end if;
  return public.admin_read_wuus_chat(thread_id) || jsonb_build_object('outcome','ok');
end $$;

create or replace function public.submit_wuus_chat_message(p_token_hash text, p_network_key text, p_request_id uuid, p_body text, p_consent_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare thread_id uuid; existing public.wuus_chat_messages%rowtype; message_id uuid;
begin
  if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' or p_network_key is null or p_network_key !~ '^[a-f0-9]{64}$'
    or p_request_id is null or p_body is null or length(trim(p_body)) not between 1 and 2000 or p_consent_version is distinct from '2026-10-19' then raise exception 'Invalid input'; end if;
  select conversation_id into thread_id from wuus_private.chat_sessions where token_hash=p_token_hash and expires_at>now();
  if thread_id is null then return jsonb_build_object('outcome','expired'); end if;
  perform 1 from public.wuus_chat_conversations where id=thread_id for update;
  select * into existing from public.wuus_chat_messages where conversation_id=thread_id and request_id=p_request_id;
  if found then
    if existing.role='visitor' and existing.body=p_body and existing.consent_version=p_consent_version then
      return jsonb_build_object('outcome','duplicate','messageId',existing.id);
    end if;
    return jsonb_build_object('outcome','conflict');
  end if;
  if (select count(*) from public.wuus_chat_messages where conversation_id=thread_id)>=200 then return jsonb_build_object('outcome','full'); end if;
  if not wuus_private.chat_allow('message:'||p_network_key,30,900) or not wuus_private.chat_allow('thread:'||thread_id,6,60) then return jsonb_build_object('outcome','limited'); end if;
  insert into public.wuus_chat_messages(conversation_id,request_id,role,body,consent_version) values (thread_id,p_request_id,'visitor',p_body,p_consent_version) returning id into message_id;
  update public.wuus_chat_conversations set version=version+1,status='waiting',updated_at=clock_timestamp() where id=thread_id;
  return jsonb_build_object('outcome','saved','messageId',message_id);
end $$;

create or replace function public.reply_wuus_chat(p_conversation_id uuid, p_request_id uuid, p_reply_to uuid, p_expected_version integer, p_body text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare thread public.wuus_chat_conversations%rowtype; existing public.wuus_chat_messages%rowtype; latest_id uuid; message_id uuid;
begin
  if p_request_id is null or p_reply_to is null or p_body is null or length(trim(p_body)) not between 1 and 2000 or p_expected_version is null or p_expected_version<1 then raise exception 'Invalid input'; end if;
  select * into thread from public.wuus_chat_conversations where id=p_conversation_id for update;
  if not found then return jsonb_build_object('outcome','expired'); end if;
  select * into existing from public.wuus_chat_messages where conversation_id=p_conversation_id and request_id=p_request_id;
  if found then
    if existing.role='team' and existing.body=p_body and existing.reply_to=p_reply_to and existing.request_version=p_expected_version then
      return jsonb_build_object('outcome','duplicate','messageId',existing.id);
    end if;
    return jsonb_build_object('outcome','conflict');
  end if;
  select id into latest_id from public.wuus_chat_messages where conversation_id=p_conversation_id order by created_at desc,id desc limit 1;
  if thread.version<>p_expected_version or latest_id is distinct from p_reply_to or not exists (
    select 1 from public.wuus_chat_messages where id=p_reply_to and conversation_id=p_conversation_id and role='visitor'
  ) then return jsonb_build_object('outcome','conflict'); end if;
  if not exists(select 1 from wuus_private.chat_sessions where conversation_id=p_conversation_id and expires_at>now()) then return jsonb_build_object('outcome','expired'); end if;
  if (select count(*) from public.wuus_chat_messages where conversation_id=p_conversation_id)>=200 then return jsonb_build_object('outcome','full'); end if;
  insert into public.wuus_chat_messages(conversation_id,request_id,role,body,reply_to,request_version)
    values(p_conversation_id,p_request_id,'team',p_body,p_reply_to,p_expected_version) returning id into message_id;
  update public.wuus_chat_conversations set version=version+1,status='replied',updated_at=clock_timestamp() where id=p_conversation_id;
  return jsonb_build_object('outcome','saved','messageId',message_id);
end $$;

revoke all on function wuus_private.chat_allow(text,integer,integer) from public,anon,authenticated,service_role;
revoke all on function public.wuus_chat_readiness(), public.admin_read_wuus_chat(uuid), public.create_wuus_chat(text,text), public.read_wuus_chat(text,text), public.submit_wuus_chat_message(text,text,uuid,text,text), public.reply_wuus_chat(uuid,uuid,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.wuus_chat_readiness(), public.admin_read_wuus_chat(uuid), public.create_wuus_chat(text,text), public.read_wuus_chat(text,text), public.submit_wuus_chat_message(text,text,uuid,text,text), public.reply_wuus_chat(uuid,uuid,uuid,integer,text) to service_role;
commit;
