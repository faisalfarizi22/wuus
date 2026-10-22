"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Volume2 } from "lucide-react";
import s from "./studio-sound.module.css";

// Audio is loaded only after an explicit user gesture; no autoplay or external provider.
const soundFiles = { click: 'click', menu: 'menu-open', gallery: 'gallery-glide', mascot: 'mascot-hello', chat: 'chat-open', sent: 'message-sent', success: 'success', attention: 'attention' } as const;
type SoundKind = keyof typeof soundFiles;
export function StudioSound({ compact = false }: { compact?: boolean }) {
  const [effects, setEffects] = useState(false);
  const [music, setMusic] = useState(false);
  const [error, setError] = useState('');
  const track = useRef<HTMLAudioElement | null>(null);
  const pool = useRef(new Map<SoundKind, HTMLAudioElement>());
  const enabled = useRef(false);
  const musicWanted = useRef(false);
  const lastEffect = useRef(0);

  function playEffect(kind: SoundKind) {
    if (!enabled.current || document.hidden) return;
    const now = performance.now();
    if (now - lastEffect.current < 120) return;
    lastEffect.current = now;
    // One voice at a time avoids stacked UI sounds during fast navigation.
    pool.current.forEach(item => item.pause());
    let item = pool.current.get(kind);
    if (!item) { item = new Audio('/sound/wuus-' + soundFiles[kind] + '.mp3'); item.preload = 'none'; pool.current.set(kind, item); }
    item.volume = kind === 'click' ? .28 : .22;
    item.currentTime = 0;
    void item.play().catch((failure: unknown) => {
      // A newer click or the mute control can intentionally interrupt playback.
      if (failure instanceof DOMException && failure.name === 'AbortError') return;
      if (enabled.current) setError('Efek suara belum bisa diputar. Coba aktifkan kembali.');
    });
  }

  function toggleMusic() {
    if (musicWanted.current) { musicWanted.current = false; track.current?.pause(); setMusic(false); return; }
    const item = track.current ?? new Audio('/sound/wuus-studio-ambient.mp3');
    track.current = item; item.preload = 'none'; item.loop = true; item.volume = .18;
    musicWanted.current = true; setError('');
    void item.play().then(() => {
      if (musicWanted.current && !document.hidden) setMusic(true);
      else item.pause();
    }).catch((failure: unknown) => {
      if (failure instanceof DOMException && failure.name === 'AbortError') return;
      musicWanted.current = false; setMusic(false); setError('Musik belum bisa diputar. Coba aktifkan kembali.');
    });
  }

  function toggleEffects() {
    enabled.current = !enabled.current; setEffects(enabled.current); setError('');
    if (enabled.current) playEffect('click'); else pool.current.forEach(item => item.pause());
  }

  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[data-sound-controls]')) return;
      const control = target.closest<HTMLElement>('a,button,summary');
      if (!control || control.matches(':disabled,[aria-disabled="true"],button[type="submit"]')) return;
      let kind = control.dataset.wuusSound as SoundKind | undefined;
      if (kind && !(kind in soundFiles)) kind = undefined;
      if (!kind && control.getAttribute('aria-controls') === 'studio-mobile-menu') {
        kind = control.getAttribute('aria-expanded') === 'true' ? 'menu' : 'click';
      }
      playEffect(kind ?? 'click');
    };
    const semantic = (event: Event) => {
      const kind = (event as CustomEvent<SoundKind>).detail;
      if (kind in soundFiles) playEffect(kind);
    };
    document.addEventListener('click', click);
    window.addEventListener('wuus:sound', semantic);
    return () => { document.removeEventListener('click', click); window.removeEventListener('wuus:sound', semantic); };
  }, []);

  useEffect(() => {
    const musicTrack = track;
    const effectPool = pool.current;
    const stop = () => {
      musicWanted.current = false; enabled.current = false;
      musicTrack.current?.pause(); effectPool.forEach(item => item.pause());
      setMusic(false); setEffects(false);
    };
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', stop);
    return () => {
      document.removeEventListener('visibilitychange', hidden); window.removeEventListener('pagehide', stop);
      musicWanted.current = false; enabled.current = false;
      musicTrack.current?.pause(); effectPool.forEach(item => item.pause()); effectPool.clear();
    };
  }, []);

  return <div className={`${s.sound} ${compact ? s.compact : ""}`} data-sound-controls>
    {compact ? null : <span>Suasana studio</span>}
    <button type="button" aria-label={compact ? `${effects ? "Matikan" : "Aktifkan"} efek suara klik` : undefined} title={`${effects ? "Matikan" : "Aktifkan"} efek suara klik`} aria-pressed={effects} onClick={toggleEffects}><Volume2 size={16} aria-hidden="true" />{compact ? <span className={s.tooltip} aria-hidden="true">Efek suara klik · {effects ? "aktif" : "mati"}</span> : <>Efek suara <b>{effects ? "Aktif" : "Mati"}</b></>}</button>
    <button type="button" aria-label={compact ? `${music ? "Matikan" : "Aktifkan"} musik latar` : undefined} title={`${music ? "Matikan" : "Aktifkan"} musik latar`} aria-pressed={music} onClick={toggleMusic}><Headphones size={16} aria-hidden="true" />{compact ? <span className={s.tooltip} aria-hidden="true">Musik latar · {music ? "aktif" : "mati"}</span> : <>Musik <b>{music ? "Aktif" : "Mati"}</b></>}</button>
    {error ? <p role="status">{error}</p> : null}
  </div>;
}
