'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, MessageCircle, X } from 'lucide-react';
import type { ChatThread } from '@/lib/sales-chat';
import s from './sales-chat.module.css';

const STORE = 'wuus-chat-draft-v1';
const CONTACT = 'https://wa.me/6281383521750?text=Halo%20WUUS%2C%20saya%20ingin%20berkonsultasi%20tentang%20website%20atau%20sistem%20usaha.';
type Draft = { requestId: string; body: string; consent: true };
class ChatHttpError extends Error { status: number; constructor(message: string, status: number) { super(message); this.status = status; } }
function restoreDraft(): { body: string; pending: Draft | null } {
  try {
    const raw = typeof window === 'undefined' ? null : sessionStorage.getItem(STORE);
    const draft = raw ? JSON.parse(raw) : null;
    if (typeof draft?.body !== 'string' || draft.body.length > 2000) return { body: '', pending: null };
    const validId = typeof draft.requestId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(draft.requestId);
    return { body: draft.body, pending: validId && draft.consent === true ? draft : null };
  } catch { return { body: '', pending: null }; }
}
async function request(path: string, body?: unknown, signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(20_000);
  const response = await fetch(path, { method: body !== undefined ? 'POST' : 'GET', cache: 'no-store', signal: signal ? AbortSignal.any([signal, timeout]) : timeout, headers: body !== undefined ? { 'Content-Type': 'application/json' } : {}, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json().catch(() => ({ error: 'Chat belum dapat diakses. Pesan Anda tetap ada.' }));
  if (!response.ok) throw new ChatHttpError(result.error || 'Chat belum dapat diakses. Pesan Anda tetap ada.', response.status);
  return result;
}
export default function WebsiteChat() {
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const close = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    let active = true, inFlight = false;
    const controller = new AbortController();
    async function refresh() {
      if (document.hidden || inFlight) return;
      inFlight = true;
      try { const data = await request('/api/chat', undefined, controller.signal); if (active) { setThread(current => current && data.conversation?.id === current.conversation.id && current.conversation.version > data.conversation.version ? current : data.conversation ? data : null); if (data.messages?.length) setConsent(true); } }
      catch (failure) { if (active) setError(failure instanceof Error ? failure.message : 'Chat belum dapat diakses.'); }
      finally { inFlight = false; }
    }
    void refresh();
    const interval = setInterval(refresh, 15_000);
    return () => { active = false; clearInterval(interval); controller.abort(); };
  }, [open]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'auto' }); }, [thread?.messages.length, open]);

  function updateText(value: string) {
    setText(value);
    try { sessionStorage.setItem(STORE, JSON.stringify({ body: value })); } catch { /* Storage is optional. */ }
  }
  function hide() { setOpen(false); trigger.current?.focus(); }
  function toggle() {
    if (open) { hide(); return; }
    if (!restored.current) {
      const draft = restoreDraft(); restored.current = true;
      setText(draft.body); setPending(draft.pending); setConsent(Boolean(draft.pending));
      if (draft.pending) setNotice('Ada pesan yang belum terkonfirmasi. Kirim ulang pesan yang sama untuk memeriksa penerimaannya.');
    }
    setOpen(true);
  }
  async function send(event: FormEvent) {
    event.preventDefault(); if (busy || !text.trim() || !consent) return;
    const draft = pending ?? { requestId: crypto.randomUUID(), body: text.trim(), consent: true as const };
    setPending(draft); setBusy(true); setError(''); setNotice('');
    try { sessionStorage.setItem(STORE, JSON.stringify(draft)); } catch { /* Never clear an uncertain in-memory send. */ }
    try {
      await request('/api/chat/session', {});
      await request('/api/chat', draft);
      window.dispatchEvent(new CustomEvent('wuus:sound', { detail: 'sent' }));
      setPending(null); setText('');
      try { sessionStorage.removeItem(STORE); } catch { /* No access token is stored here. */ }
      setNotice('Pesan tersimpan. Tim WUUS akan membalas di percakapan ini saat tersedia.');
      // A failed refresh must not turn a confirmed send into another pending send.
      try { setThread(await request('/api/chat')); } catch { /* Receipt above remains authoritative. */ }
    } catch (failure) {
      window.dispatchEvent(new CustomEvent('wuus:sound', { detail: 'attention' }));
      if (failure instanceof ChatHttpError && [400,401,403,413,415,429].includes(failure.status)) {
        // These outcomes occur before persistence; editing is safe. Keep the text.
        setPending(null);
        try { sessionStorage.setItem(STORE, JSON.stringify({ body: draft.body })); } catch { /* In-memory text is retained. */ }
      }
      setError(failure instanceof ChatHttpError ? failure.message : 'Penerimaan pesan belum terkonfirmasi. Coba kirim lagi dengan pesan yang sama; pesan tidak akan digandakan.');
    } finally { setBusy(false); }
  }

  return <div className={s.widget}>
    {open && <section className={s.panel} aria-label="Percakapan dengan WUUS" onKeyDown={event => { if (event.key === 'Escape') hide(); }}>
      <header className={s.header}><div><h2>Mari bahas usaha Anda</h2><p>Chat dengan tim WUUS</p></div><button ref={close} type="button" onClick={hide} aria-label="Tutup percakapan"><X size={20} /></button></header>
      <div className={s.messages} ref={list} role="log" aria-label="Riwayat percakapan" aria-live="polite">
        <div className={s.welcome}><p>Halo! Ceritakan usaha Anda dan bagian yang ingin dibantu. Mulai dari website, katalog, sampai pencatatan pesanan.</p><p className={s.secondary}>Pesan disimpan agar pembahasan bisa dilanjutkan. Balasan dapat dibantu AI dan tidak selalu langsung tersedia.</p></div>
        {thread?.messages.map(message => <article className={message.role === 'visitor' ? s.mine : s.theirs} key={message.id}><span>{message.role === 'visitor' ? 'Anda' : 'Tim WUUS'}</span><p>{message.body}</p><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time></article>)}
      </div>
      <form className={s.composer} onSubmit={send}>
        <label htmlFor="wuus-chat-message">Pesan Anda</label>
        <textarea id="wuus-chat-message" value={text} onChange={event => updateText(event.target.value)} maxLength={2000} rows={3} required readOnly={Boolean(pending)} placeholder="Misalnya: saya punya usaha katering di Bandung…" aria-describedby="wuus-chat-privacy" />
        {!thread?.messages.length && <label className={s.consent}><input type="checkbox" required checked={consent} disabled={Boolean(pending)} onChange={event => setConsent(event.target.checked)} /><span id="wuus-chat-privacy">Saya setuju percakapan disimpan untuk menanggapi kebutuhan saya. <a href="/kebijakan-privasi" target="_blank" rel="noreferrer">Kebijakan privasi</a></span></label>}
        {thread?.messages.length ? <p id="wuus-chat-privacy" className={s.secondary}>Jangan kirim kata sandi, PIN, atau data pembayaran.</p> : null}
        {error && <p role="alert" className={s.error}>{error}</p>}
        {notice && <p role="status" className={s.secondary}>{notice}</p>}
        <div className={s.actions}><a href={CONTACT} target="_blank" rel="noreferrer">Lanjut di WhatsApp</a><button type="submit" disabled={busy || !text.trim() || !consent}>{busy ? 'Menyimpan…' : pending ? 'Coba kirim lagi' : 'Kirim pesan'}<ArrowUp size={17} aria-hidden="true" /></button></div>
      </form>
    </section>}
    <button type="button" ref={trigger} className={s.trigger} data-wuus-sound={open ? "click" : "chat"} onClick={toggle} aria-expanded={open} title={open ? 'Tutup percakapan' : 'Konsultasi dengan WUUS'} aria-label={open ? 'Tutup chat WUUS' : 'Buka chat WUUS'}><MessageCircle size={20} aria-hidden="true" /><span>Konsultasi dengan WUUS</span></button>
  </div>;
}
