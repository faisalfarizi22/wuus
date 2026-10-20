'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ChatConversation, ChatThread } from '@/lib/sales-chat';
import s from '@/components/sales-chat/sales-chat.module.css';

async function adminRequest(path: string, body?: unknown) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Silakan masuk kembali.');
  const response = await fetch(path, { method: body ? 'POST' : 'GET', cache: 'no-store', signal: AbortSignal.timeout(20_000), headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Inbox belum dapat diakses.');
  return result;
}
type Reply = { conversationId: string; requestId: string; replyTo: string; expectedVersion: number; body: string };
export default function ChatInbox() {
  const [session, setSession] = useState<Session | null | undefined>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [threads, setThreads] = useState<ChatConversation[]>([]);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState('');
  const [pending, setPending] = useState<Reply | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const generation = useRef(0);
  const identity = useRef<string | null>(null);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      const userId = next?.user.id ?? null;
      if (userId !== identity.current) { generation.current++; identity.current = userId; setThreads([]); setThread(null); setText(''); setPending(null); }
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) return;
    let active = true;
    void adminRequest(`/api/admin/chat?page=${page}`).then(data => { if (active) { setThreads(data.conversations); setMore(data.hasMore); setError(''); } }).catch(failure => { if (active) setError(failure instanceof Error ? failure.message : 'Inbox belum dapat diakses.'); });
    return () => { active = false; };
  }, [session, page]);
  async function login(event: FormEvent) {
    event.preventDefault(); if (busy) return; setBusy(true); setError('');
    try { const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); if (error) throw new Error('Belum berhasil masuk. Periksa email dan kata sandi Anda.'); setPassword(''); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Belum berhasil masuk.'); }
    finally { setBusy(false); }
  }
  async function load(id?: string) {
    if (busy || pending) return;
    setBusy(true); setError(''); const current = generation.current;
    try {
      const data = await adminRequest(id ? `/api/admin/chat?id=${encodeURIComponent(id)}` : `/api/admin/chat?page=${page}`);
      if (current !== generation.current) return;
      if (id) { setThread(data?.conversation ? data : null); if (id !== thread?.conversation.id) setText(''); setNotice(''); }
      else { setThreads(data.conversations); setMore(data.hasMore); }
    } catch (failure) { if (current === generation.current) setError(failure instanceof Error ? failure.message : 'Inbox belum dapat diakses.'); }
    finally { if (current === generation.current) setBusy(false); }
  }
  async function send(event: FormEvent) {
    event.preventDefault(); if (busy || !thread || !text.trim()) return;
    const last = thread.messages.at(-1); if (last?.role !== 'visitor' && !pending) return;
    const reply = pending ?? { conversationId: thread.conversation.id, requestId: crypto.randomUUID(), replyTo: last!.id, expectedVersion: thread.conversation.version, body: text.trim() };
    setPending(reply); setBusy(true); setError(''); setNotice(''); const current = generation.current;
    try {
      const result = await adminRequest('/api/admin/chat', reply);
      if (current !== generation.current) return;
      setPending(null); setText(''); setNotice(`Balasan tersimpan di chat website. Tanda terima: ${result.messageId}. Belum berarti telah dibaca pelanggan.`);
      try { const data = await adminRequest(`/api/admin/chat?id=${reply.conversationId}`); if (current === generation.current) setThread(data); } catch { /* Keep the confirmed receipt. */ }
    } catch (failure) {
      if (current !== generation.current) return;
      const message = failure instanceof Error ? failure.message : 'Balasan belum terkonfirmasi. Coba ulangi balasan yang sama.';
      // A definite 409 has no new write. Keep the draft, but force a new read and review.
      if (message.startsWith('Percakapan berubah.')) { setPending(null); setNotice('Draft belum dikirim. Salin draft, lalu perbarui percakapan dan periksa pesan terbaru.'); }
      setError(message);
    } finally { if (current === generation.current) setBusy(false); }
  }
  function exportThread() {
    if (!thread) return;
    const blob = new Blob([JSON.stringify({ ...thread, exportedAt: new Date().toISOString(), instruction: 'Maya: tinjau seluruh konteks. Balasan wajib memakai conversationId, replyTo pesan visitor terakhir, expectedVersion, requestId baru dan body. Tidak ada outreach atau pengiriman kanal lain.' }, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = href; a.download = `wuus-chat-${thread.conversation.id}.json`; a.click(); URL.revokeObjectURL(href);
  }
  if (session === undefined) return <main className={s.admin}><p role="status">Memeriksa akses…</p></main>;
  if (!session) return <main className={s.admin}><form className={s.login} onSubmit={login}><Link href="/">WUUS</Link><h1>Masuk ke inbox</h1><p>Gunakan akun Owner yang sudah terdaftar. Akses percakapan diperiksa kembali oleh server.</p><label>Email<input type="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Kata sandi<input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label>{error && <p role="alert" className={s.error}>{error}</p>}<button disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk'}</button></form></main>;
  const last = thread?.messages.at(-1);
  return <main className={s.admin}>
    <header className={s.adminHeader}><div><Link href="/">WUUS</Link><h1>Inbox pelanggan</h1><p>Balasan masuk melalui chat website. Maya bekerja saat sesi Codex aktif.</p></div><button disabled={busy || Boolean(pending)} onClick={async () => { await supabase.auth.signOut({ scope: 'local' }); }}>Keluar</button></header>
    {error && <p role="alert" className={`${s.notice} ${s.error}`}>{error}</p>}{notice && <p role="status" className={s.notice}>{notice}</p>}
    <div className={s.inbox}>
      <aside className={s.threads} aria-label="Daftar percakapan"><button disabled={busy || Boolean(pending)} onClick={() => void load()}>Perbarui inbox</button>{!threads.length && <p className={s.secondary}>Belum ada percakapan pada halaman ini.</p>}{threads.map((item, index) => <button key={item.id} disabled={busy || Boolean(pending)} className={thread?.conversation.id === item.id ? s.selected : ''} onClick={() => void load(item.id)}>Percakapan {page * 50 + index + 1} · {item.status === 'waiting' ? 'Menunggu balasan' : 'Sudah dibalas'}<span>{new Date(item.updated_at).toLocaleString('id-ID')}</span></button>)}<div className={s.actions}><button disabled={!page || busy || Boolean(pending)} onClick={() => setPage(value => value - 1)}>Sebelumnya</button><button disabled={!more || busy || Boolean(pending)} onClick={() => setPage(value => value + 1)}>Berikutnya</button></div></aside>
      <section className={s.detail} aria-label="Isi percakapan">{thread ? <><h2>Pembahasan pelanggan</h2><p className={s.secondary}>Periksa semua pesan sebelum menjawab. Harga dan lingkup harus mengikuti penawaran WUUS; jangan menjanjikan hal yang belum disepakati.</p><div className={s.actions}><button disabled={busy || Boolean(pending)} onClick={() => void load(thread.conversation.id)}>Perbarui percakapan</button><button onClick={exportThread}>Unduh konteks untuk Maya</button></div><div className={s.messages}>{thread.messages.map(item => <article key={item.id} className={item.role === 'team' ? s.mine : s.theirs}><span>{item.role === 'visitor' ? 'Pelanggan' : 'Tim WUUS'}</span><p>{item.body}</p><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString('id-ID')}</time></article>)}</div><form onSubmit={send}><label htmlFor="chat-admin-reply">Balasan tim</label><textarea id="chat-admin-reply" maxLength={2000} value={text} onChange={event => setText(event.target.value)} readOnly={Boolean(pending)} disabled={!pending && last?.role !== 'visitor'} /><p className={s.secondary}>Balasan terikat pada pesan terakhir dan versi percakapan {thread.conversation.version}. Jika ada pesan baru, periksa ulang konteksnya.</p><div className={s.actions}><span className={s.secondary}>Balasan tersimpan di website, tanpa mengirim email atau WhatsApp.</span><button disabled={busy || !text.trim() || (!pending && last?.role !== 'visitor')}>{busy ? 'Menyimpan…' : pending ? 'Periksa kiriman yang sama' : 'Kirim balasan'}</button></div></form></> : <p>Pilih percakapan untuk melihat kebutuhan pelanggan dan menyiapkan balasan.</p>}</section>
    </div>
  </main>;
}
