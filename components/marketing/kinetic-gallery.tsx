"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { conceptCatalog } from "@/lib/concept-catalog";
import { clampGalleryScroll, galleryCategoryAt, galleryLean, galleryWheelPixels } from "@/lib/kinetic-gallery";
import s from "./kinetic-gallery.module.css";

const categories = ["Kuliner", "Jasa", "Produk", "Pendidikan"] as const;
const groups = categories.map(category => ({ category, items: conceptCatalog.filter(item => item.category === category) }));
type GalleryView = { category: string; previous: boolean; next: boolean };
type Navigate = (target: number | string, kind?: "wheel" | "navigation") => void;

export function KineticGallery() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const navigate = useRef<Navigate>(() => {});
  const [view, setView] = useState<GalleryView>({ category: "Kuliner", previous: false, next: true });

  useEffect(() => {
    const root = section.current, track = rail.current, meter = progress.current;
    if (!root || !track || !meter) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const groupNodes = Array.from(track.querySelectorAll<HTMLElement>("[data-gallery-group]"));
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-gallery-lean]"));
    let anchors: { category: string; left: number }[] = [];
    let positions: { left: number; right: number }[] = [];
    let maximum = 0, viewport = 0, frame = 0, measureFrame = 0;
    let visible = true, previousTime = 0, previousScroll = track.scrollLeft, lean = 0, settleUntil = 0;
    let movement: { from: number; to: number; start: number; duration: number } | null = null;
    let lastView: GalleryView = { category: "Kuliner", previous: false, next: true };

    const clearLean = () => {
      lean = 0;
      for (const card of cards) { card.style.transform = ""; card.style.willChange = ""; }
    };
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; movement = null; previousTime = 0; clearLean();
    };
    const updateView = (position: number) => {
      const next = { category: galleryCategoryAt(anchors, position, viewport, maximum), previous: position > 2, next: position < maximum - 2 };
      if (next.category !== lastView.category || next.previous !== lastView.previous || next.next !== lastView.next) {
        lastView = next; setView(next);
      }
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    // Velocity is an explicit interaction requirement here. Measurements are cached;
    // this bounded frame loop stops after the input and the lean have settled.
    const tick = (now: number) => {
      frame = 0;
      if (document.hidden || !visible) { stop(); return; }
      const current = track.scrollLeft;
      const elapsed = previousTime ? Math.min(64, Math.max(8, now - previousTime)) : 16;
      let position = current;
      if (movement) {
        const fraction = Math.min(1, (now - movement.start) / movement.duration);
        const eased = 1 - Math.pow(1 - Math.max(0, fraction), 4);
        position = movement.from + (movement.to - movement.from) * eased;
        if (fraction >= 1) movement = null;
      }
      const velocity = previousTime ? (position - previousScroll) / elapsed : 0;
      const target = galleryLean(velocity, media.matches);
      lean += (target - lean) * (1 - Math.exp(-elapsed / 65));
      if (media.matches) lean = 0;
      previousScroll = position; previousTime = now;

      // All reads above; compositor-only writes below, on nearby cards only.
      if (position !== current) track.scrollLeft = position;
      meter.style.transform = `scaleX(${maximum > 0 ? Math.min(1, position / maximum) : 1})`;
      cards.forEach((card, index) => {
        const near = positions[index] && positions[index].right > position - 100 && positions[index].left < position + viewport + 100;
        if (near && Math.abs(lean) > .03) {
          card.style.willChange = "transform";
          card.style.transform = `perspective(1200px) rotateY(${lean * -.3}deg) rotateZ(${lean}deg)`;
        } else { card.style.transform = ""; card.style.willChange = ""; }
      });
      updateView(position);
      if (movement || Math.abs(lean) > .03 || now < settleUntil) schedule();
      else { previousTime = 0; clearLean(); }
    };
    const measure = () => {
      measureFrame = 0;
      const box = track.getBoundingClientRect(), offset = track.scrollLeft;
      viewport = track.clientWidth; maximum = Math.max(0, track.scrollWidth - viewport);
      anchors = groupNodes.map(group => ({ category: group.dataset.galleryGroup ?? "", left: group.getBoundingClientRect().left - box.left + offset }));
      positions = cards.map(card => ({ left: card.offsetLeft, right: card.offsetLeft + card.offsetWidth }));
      if (movement) movement.to = clampGalleryScroll(movement.to, maximum);
      previousTime = 0; schedule();
    };
    const requestMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure); };
    const go: Navigate = (destination, kind = "navigation") => {
      const from = track.scrollLeft;
      let target: number;
      if (typeof destination === "string") {
        if (destination === "previous" || destination === "next") {
          const candidates = positions.map(position => position.left - Math.max(20, viewport * .055));
          target = destination === "next"
            ? candidates.find(position => position > from + 8) ?? maximum
            : [...candidates].reverse().find(position => position < from - 8) ?? 0;
        } else target = (anchors.find(anchor => anchor.category === destination)?.left ?? 0) - Math.max(20, viewport * .055);
      } else target = destination;
      target = clampGalleryScroll(target, maximum);
      if (Math.abs(target - from) < .5) return;
      if (media.matches) { stop(); track.scrollLeft = target; schedule(); return; }
      movement = { from, to: target, start: performance.now(), duration: kind === "wheel" ? 320 : Math.min(1150, Math.max(520, Math.abs(target - from) * .28)) };
      settleUntil = performance.now() + 150;
      schedule();
    };
    navigate.current = go;
    const onScroll = () => { settleUntil = performance.now() + 130; schedule(); };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.deltaY) {
        movement = null;
        return;
      }
      const current = track.scrollLeft;
      const delta = galleryWheelPixels(event.deltaY, event.deltaMode, viewport);
      if ((delta < 0 && current <= 1) || (delta > 0 && current >= maximum - 1)) return;
      event.preventDefault();
      const target = clampGalleryScroll((movement?.to ?? current) + delta, maximum);
      if (movement?.to !== target) go(target, "wheel");
    };
    const interrupt = () => { movement = null; };
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== track || event.altKey || event.metaKey || event.ctrlKey) return;
      const destination = event.key === "ArrowRight" ? "next" : event.key === "ArrowLeft" ? "previous" : event.key === "Home" ? 0 : event.key === "End" ? maximum : undefined;
      if (destination === undefined) return;
      event.preventDefault(); go(destination);
    };
    const onVisibility = () => { if (document.hidden) stop(); else { previousTime = 0; schedule(); } };
    const onPreference = () => { stop(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); else { previousTime = 0; schedule(); } }, { rootMargin: "120px" });
    const resize = new ResizeObserver(requestMeasure);
    observer.observe(root); resize.observe(track); for (const group of groupNodes) resize.observe(group);
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", interrupt, { passive: true });
    track.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener("change", onPreference);
    measure();
    return () => {
      stop(); cancelAnimationFrame(measureFrame); observer.disconnect(); resize.disconnect();
      track.removeEventListener("scroll", onScroll); track.removeEventListener("wheel", onWheel); track.removeEventListener("pointerdown", interrupt); track.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility); media.removeEventListener("change", onPreference);
      navigate.current = () => {};
    };
  }, []);

  return <section ref={section} id="design-catalog" className={s.gallery} aria-labelledby="design-catalog-title">
    <div className={s.heading}>
      <h2 id="design-catalog-title">Beda usaha.<br /><em>Beda ceritanya.</em></h2>
      <div className={s.intro}><p>Dari menu makan siang sampai koleksi pilihan. Jelajahi website yang dirancang mengikuti cara setiap usaha bekerja.</p><span><MoveHorizontal size={16} aria-hidden="true" /> Geser untuk menjelajahi semua contoh</span></div>
    </div>
    <div className={s.navigation}>
      <div className={s.categories} role="group" aria-label="Geser ke kategori contoh desain">
        {groups.map(group => <button key={group.category} type="button" aria-pressed={view.category === group.category} aria-controls="design-gallery-rail" onClick={() => navigate.current(group.category)}>{group.category}<span>{group.items.length}</span></button>)}
      </div>
      <div className={s.arrows} role="group" aria-label="Navigasi contoh desain">
        <button type="button" aria-label="Contoh desain sebelumnya" disabled={!view.previous} onClick={() => navigate.current("previous")}><ArrowLeft size={20} /></button>
        <button type="button" aria-label="Contoh desain berikutnya" disabled={!view.next} onClick={() => navigate.current("next")}><ArrowRight size={20} /></button>
      </div>
    </div>
    <div ref={rail} id="design-gallery-rail" className={s.rail} role="region" aria-label="Delapan contoh website, dikelompokkan menurut jenis usaha" tabIndex={0}>
      {groups.map(group => <div key={group.category} className={s.group} data-gallery-group={group.category} role="group" aria-labelledby={`gallery-${group.category.toLowerCase()}`}>
        <h3 id={`gallery-${group.category.toLowerCase()}`} className={s.groupTitle}>{group.category}<span>{group.items.length} contoh desain</span></h3>
        <div className={s.cards}>{group.items.map(item => <article className={s.card} key={item.slug}>
          <Link className={s.preview} data-gallery-lean href={`/contoh/${item.slug}`} aria-label={`Buka website contoh desain ${item.name}`}>
            <div className={s.browserBar} aria-hidden="true"><span className={s.browserDots}><i /><i /><i /></span><span>{item.name.toLowerCase().replaceAll(" ", "")}.website</span><ArrowUpRight size={14} /></div>
            <div className={s.screenshot}><Image src={`/images/concepts/${item.slug}/preview-v2.webp`} alt={`Tampilan website ${item.name}`} fill sizes="(max-width:600px) 84vw, (max-width:1100px) 65vw, 700px" /></div>
            <span className={s.open}>Jelajahi website <ArrowUpRight size={16} /></span>
          </Link>
          <div className={s.cardCopy}><div><h4><Link href={`/contoh/${item.slug}`}>{item.name}</Link></h4><p>{item.description}</p></div><ArrowUpRight size={21} aria-hidden="true" /></div>
        </article>)}</div>
      </div>)}
    </div>
    <div className={s.bottom}><div className={s.progress} aria-hidden="true"><span ref={progress} /></div><p>Contoh desain untuk Anda jelajahi dan coba. Nama serta isi usaha bersifat fiktif.</p></div>
  </section>;
}
