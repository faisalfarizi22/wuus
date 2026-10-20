'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {ArrowUpRight, Check, Copy, Download} from 'lucide-react';
import s from './concept-tools.module.css';

export type ConceptChoice = {
  id: string;
  label: string;
  title: string;
  description: string;
  details: readonly string[];
  action: string;
};

/** One decision at a time; each choice continues into the actual page controls. */
export function ConceptChoiceGuide({title, description, choices, target, onChoose}: {
  title: string; description: string; choices: readonly ConceptChoice[];
  target: string; onChoose: (id: string) => void;
}) {
  const [selected, setSelected] = useState(choices[0].id);
  const choice = choices.find(item => item.id === selected) ?? choices[0];
  const groupId = useId();
  return <section className={s.guide} aria-labelledby={`${groupId}-title`}>
    <div className={s.intro}>
      <h2 id={`${groupId}-title`}>{title}</h2>
      <p>{description}</p>
      <fieldset className={s.options}>
        <legend>Kebutuhan Anda</legend>
        {choices.map(item => <label key={item.id} className={selected === item.id ? s.chosen : ''}>
          <input type="radio" name={groupId} value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)}/>
          <span>{item.label}</span><ArrowUpRight size={18} aria-hidden="true"/>
        </label>)}
      </fieldset>
    </div>
    <div className={s.decision} aria-live="polite" aria-atomic="true">
      <div className={s.decisionContent} key={choice.id}>
        <h3>{choice.title}</h3><p>{choice.description}</p>
        <ul>{choice.details.map(detail => <li key={detail}><Check size={17} aria-hidden="true"/><span>{detail}</span></li>)}</ul>
        <a href={target} onClick={() => onChoose(choice.id)}>{choice.action}<ArrowUpRight size={19} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}

/** Export stays local: neither clipboard nor download transmits an order. */
export function SummaryActions({text, filename}: {text: string; filename: string}) {
  const [message, setMessage] = useState('');
  if (!text) return null;
  return <div className={s.export}>
    <div className={s.exportButtons}>
      <button type="button" onClick={async () => {
        try { await navigator.clipboard.writeText(text); setMessage('Ringkasan tersalin.'); }
        catch { setMessage('Salin otomatis belum tersedia. Pilih teks ringkasan di atas, lalu gunakan menu Salin.'); }
      }}><Copy size={16} aria-hidden="true"/>Salin ringkasan</button>
      <button type="button" onClick={() => {
        const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = `${filename}.txt`; anchor.hidden = true;
        document.body.append(anchor); anchor.click(); anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage('File ringkasan disiapkan untuk diunduh. Belum ada pesanan yang dikirim.');
      }}><Download size={16} aria-hidden="true"/>Simpan .txt</button>
    </div>
    <p role="status">{message}</p>
  </div>;
}

/** A bounded observer keeps section navigation honest without a scroll loop. */
export function ConceptSectionNavigation() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const site = marker.current?.parentElement;
    if (!site || !('IntersectionObserver' in window)) return;
    const links = [...site.querySelectorAll<HTMLAnchorElement>('header nav a[href^="#"]')];
    const entries = new Map<Element, number>();
    const sections = [...new Set(links.flatMap(link => {
      const target = site.querySelector<HTMLElement>(link.hash);
      return target ? [target] : [];
    }))];
    const observer = new IntersectionObserver(changes => {
      for (const change of changes) {
        if (change.isIntersecting) entries.set(change.target, change.boundingClientRect.top);
        else entries.delete(change.target);
      }
      const active = [...entries].sort((a,b) => Math.abs(a[1]) - Math.abs(b[1]))[0]?.[0];
      for (const link of links) {
        if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      }
    }, {rootMargin:'-16% 0px -55% 0px', threshold:0});
    sections.forEach(section => observer.observe(section));
    return () => { observer.disconnect(); links.forEach(link => link.removeAttribute('aria-current')); };
  }, []);
  return <span ref={marker} hidden/>;
}
