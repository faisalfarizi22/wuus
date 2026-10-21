"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Volume2 } from "lucide-react";
import s from "./studio-sound.module.css";

// Locally synthesised tones. No microphone, media tracking, downloads or remote audio.
export function StudioSound({ compact = false }: { compact?: boolean }) {
  const [effects, setEffects] = useState(false);
  const [music, setMusic] = useState(false);
  const [error, setError] = useState("");
  const engine = useRef<AudioContext | null>(null);
  const musicTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const voices = useRef<OscillatorNode[]>([]);

  function audio() {
    if (!window.AudioContext) { setError("Suara belum didukung di browser ini."); return null; }
    const context = engine.current ?? new AudioContext();
    engine.current = context;
    void context.resume().catch(() => setError("Suara belum bisa diputar. Coba aktifkan kembali."));
    return context;
  }

  function stopMusic() {
    if (musicTimer.current) clearInterval(musicTimer.current);
    musicTimer.current = null;
    voices.current.forEach(voice => { try { voice.stop(); } catch { /* Already ended. */ } voice.disconnect(); });
    voices.current = [];
  }

  function toggleMusic() {
    if (music) { stopMusic(); setMusic(false); return; }
    const context = audio();
    if (!context) return;
    let chord = 0;
    const chords = [[130.81, 164.81, 196], [110, 130.81, 164.81], [87.31, 130.81, 174.61], [98, 146.83, 196]];
    const play = () => {
      const now = context.currentTime;
      for (const frequency of chords[chord++ % chords.length]) {
        const wave = context.createOscillator();
        const gain = context.createGain();
        wave.type = "sine";
        wave.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(.012, now + 1.5);
        gain.gain.linearRampToValueAtTime(0, now + 6);
        wave.connect(gain); gain.connect(context.destination);
        voices.current.push(wave);
        wave.onended = () => { wave.disconnect(); gain.disconnect(); voices.current = voices.current.filter(node => node !== wave); };
        wave.start(now); wave.stop(now + 6.1);
      }
    };
    play(); musicTimer.current = setInterval(play, 5500); setMusic(true);
  }

  useEffect(() => {
    if (!effects) return;
    const click = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("a,button") || target.closest("[data-sound-controls]") || document.hidden) return;
      const context = engine.current;
      if (!context || context.state !== "running") return;
      const wave = context.createOscillator(), gain = context.createGain(), now = context.currentTime;
      wave.frequency.setValueAtTime(520, now); wave.frequency.exponentialRampToValueAtTime(390, now + .065);
      gain.gain.setValueAtTime(.022, now); gain.gain.exponentialRampToValueAtTime(.001, now + .075);
      wave.connect(gain); gain.connect(context.destination);
      wave.onended = () => { wave.disconnect(); gain.disconnect(); };
      wave.start(now); wave.stop(now + .08);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [effects]);

  useEffect(() => {
    const hidden = () => {
      if (!document.hidden) return;
      if (musicTimer.current) clearInterval(musicTimer.current);
      musicTimer.current = null;
      voices.current.forEach(voice => { try { voice.stop(); } catch { /* Already ended. */ } });
      voices.current = [];
      void engine.current?.suspend();
      setMusic(false); setEffects(false);
    };
    document.addEventListener("visibilitychange", hidden);
    return () => { document.removeEventListener("visibilitychange", hidden); if (musicTimer.current) clearInterval(musicTimer.current); void engine.current?.close(); };
  }, []);

  return <div className={`${s.sound} ${compact ? s.compact : ""}`} data-sound-controls>
    {compact ? null : <span>Suasana studio</span>}
    <button type="button" aria-label={compact ? `${effects ? "Matikan" : "Aktifkan"} efek suara klik` : undefined} title={`${effects ? "Matikan" : "Aktifkan"} efek suara klik`} aria-pressed={effects} onClick={() => { if (effects) setEffects(false); else if (audio()) setEffects(true); }}><Volume2 size={16} aria-hidden="true" />{compact ? <span className={s.tooltip} aria-hidden="true">Efek suara klik · {effects ? "aktif" : "mati"}</span> : <>Efek suara <b>{effects ? "Aktif" : "Mati"}</b></>}</button>
    <button type="button" aria-label={compact ? `${music ? "Matikan" : "Aktifkan"} musik latar` : undefined} title={`${music ? "Matikan" : "Aktifkan"} musik latar`} aria-pressed={music} onClick={toggleMusic}><Headphones size={16} aria-hidden="true" />{compact ? <span className={s.tooltip} aria-hidden="true">Musik latar · {music ? "aktif" : "mati"}</span> : <>Musik <b>{music ? "Aktif" : "Mati"}</b></>}</button>
    {error ? <p role="status">{error}</p> : null}
  </div>;
}
