import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

// Run actual Next route functions. Only Supabase's external HTTP transport is local.
const root = new URL('../', import.meta.url);
registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'server-only') return { url: 'data:text/javascript,export{}', shortCircuit: true };
  const target = specifier.startsWith('@/') ? new URL(`${specifier.slice(2)}.ts`, root) : specifier.startsWith('.') && context.parentURL?.endsWith('.ts') ? new URL(`${specifier}.ts`, context.parentURL) : null;
  if (target && existsSync(target)) return next(target.href,context);
  return next(specifier,context);
} });
const routes = await import('../app/api/chat/route.ts');
const sessions = await import('../app/api/chat/session/route.ts');
const admin = await import('../app/api/admin/chat/route.ts');
const origin = 'https://webuntukusaha.com';
const request = (path, body, headers = {}) => new Request(origin + path, { method: body === undefined ? 'GET' : 'POST', headers: { ...(body !== undefined ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });

test('visitor request → cookie → saved message → authenticated version-bound reply → isolated read', async () => {
  const db = new PGlite(); const originalFetch = globalThis.fetch;
  const vars = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','WUUS_ADMIN_USER_IDS','WUUS_RATE_LIMIT_SECRET','NODE_ENV'];
  const old = Object.fromEntries(vars.map(key => [key,process.env[key]]));
  let calls = 0;
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(await readFile(new URL('../supabase/migrations/202610190001_website_chat.sql',import.meta.url),'utf8'));
    process.env.NEXT_PUBLIC_SUPABASE_URL='https://local-test.invalid'; process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='test-anon'; process.env.SUPABASE_SERVICE_ROLE_KEY='test-service'; process.env.WUUS_ADMIN_USER_IDS='owner-user'; process.env.WUUS_RATE_LIMIT_SECRET='unit-test-only-not-a-real-secret-1234'; process.env.NODE_ENV='production';
    globalThis.fetch = async (input, init) => {
      const req = new Request(input,init), url = new URL(req.url); calls++;
      assert.equal(url.hostname,'local-test.invalid','No real network is permitted');
      if (url.pathname === '/auth/v1/user') return Response.json({ id: req.headers.get('authorization') === 'Bearer owner-access' ? 'owner-user' : 'another-user', aud:'authenticated', role:'authenticated', app_metadata:{}, user_metadata:{}, created_at:new Date().toISOString() });
      const name = url.pathname.split('/rest/v1/rpc/')[1];
      assert.ok(name && /^[a-z_]+$/.test(name));
      const body = JSON.parse(await req.text());
      try {
        const fields = Object.keys(body), params = fields.map((key,i) => `${key} => $${i+1}`).join(',');
        const data = (await db.query(`select public.${name}(${params}) as result`,Object.values(body))).rows[0].result;
        return Response.json(data);
      } catch { return Response.json({ message:'Local database error', code:'TEST' },{status:400}); }
    };
    assert.equal((await sessions.POST(request('/api/chat/session',{}, {Origin:'https://untrusted.invalid'}))).status,403);
    assert.equal(calls,0);
    assert.equal((await admin.GET(request('/api/admin/chat'))).status,401);
    assert.equal((await admin.GET(request('/api/admin/chat?id='+randomUUID(),undefined,{Authorization:'Bearer other-access'}))).status,403);
    const bootstrap = await sessions.POST(request('/api/chat/session',{}));
    assert.equal(bootstrap.status,200);
    const setCookie = bootstrap.headers.get('set-cookie');
    assert.match(setCookie,/HttpOnly/); assert.match(setCookie,/SameSite=Strict/); assert.match(setCookie,/; Secure/); assert.match(setCookie,/Path=\/api\/chat/);
    const cookie = setCookie.split(';')[0], initial = await bootstrap.json();
    assert.equal(JSON.stringify(initial).includes(cookie.slice('wuus_chat='.length)),false);
    const input = { requestId:randomUUID(), body:'Saya ingin website untuk usaha.', consent:true };
    const sent = await routes.POST(request('/api/chat',input,{Cookie:cookie})); assert.equal(sent.status,201);
    assert.equal((await routes.POST(request('/api/chat',input,{Cookie:cookie}))).status,200);
    assert.equal((await routes.POST(request('/api/chat',{...input,body:'Pesan berubah'},{Cookie:cookie}))).status,409);
    assert.equal((await routes.POST(request('/api/chat',{...input,requestId:randomUUID(),consent:false},{Cookie:cookie}))).status,400);
    const read = await (await routes.GET(request('/api/chat',undefined,{Cookie:cookie}))).json();
    assert.equal(read.messages.length,1); assert.equal(read.conversation.version,1);
    const other = await sessions.POST(request('/api/chat/session',{})), otherCookie = other.headers.get('set-cookie').split(';')[0];
    assert.equal((await (await routes.GET(request('/api/chat',undefined,{Cookie:otherCookie}))).json()).messages.length,0);
    assert.equal((await routes.GET(request('/api/chat',undefined,{Cookie:cookie,'Sec-Fetch-Site':'cross-site'}))).status,403);
    const reply = { conversationId:read.conversation.id, requestId:randomUUID(), replyTo:read.messages[0].id, expectedVersion:1, body:'Boleh ceritakan jenis usaha dan kebutuhan utamanya?' };
    const saved = await admin.POST(request('/api/admin/chat',reply,{Authorization:'Bearer owner-access'}));
    assert.equal(saved.status,200); assert.equal((await saved.json()).outcome,'saved');
    assert.equal((await (await admin.POST(request('/api/admin/chat',reply,{Authorization:'Bearer owner-access'}))).json()).outcome,'duplicate');
    assert.equal((await admin.POST(request('/api/admin/chat',{...reply,requestId:randomUUID()},{Authorization:'Bearer owner-access'}))).status,409);
    const final = await (await routes.GET(request('/api/chat',undefined,{Cookie:cookie}))).json(); assert.equal(final.messages.length,2); assert.equal(final.messages.at(-1).body,reply.body);
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal((await routes.GET(request('/api/chat'))).status,503,'Not-ready fails closed, without claiming saved');
  } finally {
    globalThis.fetch=originalFetch;
    for (const key of vars) { if (old[key] === undefined) delete process.env[key]; else process.env[key]=old[key]; }
    await db.close();
  }
});
