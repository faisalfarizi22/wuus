"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { BrandArtwork } from "./brand-artwork";
import { StudioSound } from "./studio-sound";
import s from "./studio-header.module.css";

const links = [
  { label: "Contoh desain", id: "examples" },
  { label: "Layanan", id: "services" },
  { label: "Harga", id: "pricing" },
  { label: "Cara kerja", id: "process" },
] as const;
const mobileLinks = [...links, { label: "FAQ", id: "faq" }];

const consultation = "https://wa.me/6281383521750?text=" + encodeURIComponent(
  "Halo WUUS, saya ingin membahas website usaha.\nJenis usaha:\nKota:\nKebutuhan:",
);

export function StudioHeader({ night, onToggleNight }: { night: boolean; onToggleNight: () => void }) {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Observe a reading band below the header, rather than updating on every scroll frame.
    const sections = links.map(link => document.getElementById(link.id)).filter((node): node is HTMLElement => Boolean(node));
    const contact = document.getElementById("contact");
    const hero = document.querySelector("main > section");
    const targets = [...sections, ...(contact ? [contact] : []), ...(hero ? [hero] : [])];
    const update = () => {
      const readingLine = 170;
      const positions = targets.map(node => ({ node, rect: node.getBoundingClientRect() }));
      const current = positions.find(({ rect }) => rect.top <= readingLine && rect.bottom > readingLine)
        ?? positions.find(({ rect }) => rect.top >= readingLine && rect.top < window.innerHeight * .5);
      if (current) setActive(links.some(link => link.id === current.node.id) ? current.node.id : "");
    };
    const observer = new IntersectionObserver(update, { rootMargin: "-104px 0px -55% 0px", threshold: [0, .25, .6, 1] });
    targets.forEach(node => observer.observe(node));
    const hashChanged = () => {
      const id = window.location.hash.slice(1);
      if (links.some(link => link.id === id)) setActive(id);
      else if (id === "main" || id === "contact") setActive("");
    };
    update();
    window.addEventListener("hashchange", hashChanged);
    // A smooth anchor scroll can settle between observer thresholds.
    // Reconcile once it stops, without adding a per-frame scroll handler.
    window.addEventListener("scrollend", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", hashChanged);
      window.removeEventListener("scrollend", update);
    };
  }, []);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!header.current?.contains(event.target)) setMenu(false);
    };
    // The mobile panel is a disclosure, not a modal: normal page Tab order stays available.
    const desktop = window.matchMedia("(min-width: 1000px)");
    const resize = () => { if (desktop.matches) setMenu(false); };
    document.addEventListener("pointerdown", dismissOutside);
    desktop.addEventListener("change", resize);
    return () => { document.removeEventListener("pointerdown", dismissOutside); desktop.removeEventListener("change", resize); };
  }, []);

  function followSection(id: string) {
    setActive(id);
    setMenu(false);
    // A chosen link leads into the content; only Escape/dismissal returns to the menu trigger.
    if (menu) window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const temporaryTabStop = !target.hasAttribute("tabindex");
      if (temporaryTabStop) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (temporaryTabStop) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    });
  }

  return <header ref={header} className={s.header} data-tone={night ? "night" : "day"} onKeyDown={event => {
    if (event.key !== "Escape") return;
    if (menu) {
      setMenu(false);
      menuButton.current?.focus();
    } else return;
    event.stopPropagation();
  }}>
    <a href="#main" className={s.skip}>Lewati ke konten</a>
    <div className={s.bar}>
      <a href="#main" className={s.brand} aria-label="WUUS — beranda"><BrandArtwork className={s.brandArtwork} /></a>
      <nav className={s.nav} aria-label="Navigasi utama">
        <ul>{links.map(link => <li key={link.id}><a href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined} onClick={() => followSection(link.id)}>{link.label}</a></li>)}</ul>
        <a href="#contact" className={s.consult} onClick={() => followSection("contact")}>Mari ngobrol <ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
      <div className={s.actions}>
        <div className={s.tools} aria-label="Suasana tampilan">
          <StudioSound compact />
          <button type="button" className={s.iconButton} aria-pressed={night} aria-label={night ? "Aktifkan tampilan siang" : "Aktifkan tampilan malam"} title={night ? "Tampilan siang" : "Tampilan malam"} onClick={onToggleNight}>
            {night ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span className={s.tooltip} aria-hidden="true">{night ? "Tampilan siang" : "Tampilan malam"}</span>
          </button>
        </div>
        <button ref={menuButton} type="button" className={`${s.iconButton} ${s.menuButton}`} aria-expanded={menu} aria-controls="studio-mobile-menu" aria-label={menu ? "Tutup navigasi" : "Buka navigasi"} onClick={() => setMenu(value => !value)}>
          {menu ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>
    </div>
    {menu ? <div id="studio-mobile-menu" className={s.mobileMenu}>
      <nav aria-label="Navigasi utama di ponsel"><ul>{mobileLinks.map(link => <li key={link.id}><a href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined} onClick={() => followSection(link.id)}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}</ul></nav>
      <a href={consultation} className={s.mobileConsult} onClick={() => setMenu(false)}>Konsultasi lewat WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></a>
      <div className={s.mobileAudience}>
        <span>Anda sedang di WUUS Indonesia</span>
        <Link href="/hospitality" lang="en" onClick={() => setMenu(false)}>Hospitality · English <ArrowUpRight size={14} aria-hidden="true" /></Link>
        <Link href="/blog" lang="en" onClick={() => setMenu(false)}>Blog · English <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </div> : null}
  </header>;
}
