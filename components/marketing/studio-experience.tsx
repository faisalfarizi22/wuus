"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { BrandArtwork } from "./brand-artwork";
import { StudioSound } from "./studio-sound";
import base from "./marketing.module.css";
import s from "./studio-experience.module.css";

const links = [["Contoh desain", "#examples"], ["Layanan", "#services"], ["Harga", "#pricing"], ["Cara kerja", "#process"]];

export function StudioExperience({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visibility = () => { if (root.current) root.current.dataset.motion = document.hidden ? "paused" : "active"; };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  return <div ref={root} lang="id" className={`${base.site} ${base.experience} ${s.experience}`} data-wuus-tone={night ? "night" : "day"}>
    <header className={s.header} onKeyDown={event => { if (event.key === "Escape") setMenu(false); }}>
      <a href="#main" className={base.skip}>Lewati ke konten</a>
      <Link href="/" className={s.brand} aria-label="WUUS beranda"><BrandArtwork className={s.brandArtwork} /></Link>
      <nav className={s.nav} aria-label="Navigasi utama">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a href="#contact" className={s.navContact}>Mari ngobrol <ArrowUpRight size={15} /></a>
      </nav>
      <div className={s.utilities}>
        <StudioSound compact />
        <button type="button" className={s.iconButton} aria-pressed={night} aria-label={night ? "Ganti ke suasana siang" : "Ganti ke suasana malam"} title={night ? "Suasana siang" : "Suasana malam"} onClick={() => setNight(value => !value)}>{night ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button type="button" className={`${s.iconButton} ${s.menuButton}`} aria-expanded={menu} aria-controls="studio-mobile-menu" aria-label={menu ? "Tutup menu" : "Buka menu"} onClick={() => setMenu(value => !value)}>{menu ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {menu ? <nav id="studio-mobile-menu" className={s.mobileMenu} aria-label="Navigasi mobile">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
        <a href="#contact" onClick={() => setMenu(false)}>Mari ngobrol <ArrowUpRight size={17} /></a>
        <Link href="/hospitality" onClick={() => setMenu(false)}>Hospitality · English</Link>
      </nav> : null}
    </header>
    {children}
  </div>;
}

const greetings = ["Punya ide untuk usaha Anda?", "Coba jelajahi contoh desainnya.", "Mulai dari yang paling Anda butuhkan."];

export function StudioHero() {
  const section = useRef<HTMLElement>(null);
  const [greeting, setGreeting] = useState(0);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { node.dataset.visible = String(entry.isIntersecting); }, { threshold: .05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <section ref={section} className={s.hero} data-visible="true" aria-labelledby="studio-hero-title">
    <div className={s.heroInner}>
      <div className={s.heroCopy}>
        <h1 id="studio-hero-title">Usaha Anda.<br />Tampil lebih<br /><span>meyakinkan.</span></h1>
        <p>Kami bantu wujudkan website yang enak dilihat dan mudah dipakai. Untuk usaha Anda, di mana pun di Indonesia.</p>
        <div className={s.heroActions}>
          <a href="#examples" className={s.primary}>Temukan desain Anda <ArrowUpRight size={19} /></a>
          <a href="#pricing" className={s.secondary}>Lihat harga <span>Mulai Rp750 ribu</span></a>
        </div>
      </div>
      <div className={s.world}>
        <div className={s.orbits} aria-hidden="true"><span /><span /><i /></div>
        <div className={s.planetShadow} aria-hidden="true" />
        <div className={s.planetFloat}>
          <button type="button" className={s.planet} aria-label="Sapa teman studio WUUS" onClick={() => setGreeting(value => (value + 1) % greetings.length)}>
            <Image src="/images/studio/wuus-orbit-v2.webp" alt="Teman studio WUUS, globe keramik dengan orbit amber" width={960} height={960} priority sizes="(max-width:700px) 90vw, 48vw" />
          </button>
        </div>
        <p className={s.greeting} aria-live="polite">{greetings[greeting]}</p>
        <span className={s.worldNote}>Ide Anda, kita wujudkan bersama.</span>
      </div>
    </div>
    <div className={s.heroBottom}>
      <span>Website. Katalog. Sistem usaha.</span>
      <a href="#examples">Jelajahi WUUS <ArrowDown size={16} /></a>
      <span>Berbasis di Jakarta · Untuk seluruh Indonesia</span>
    </div>
  </section>;
}

export function StudioClosing() {
  return <footer id="contact" className={s.closing} aria-labelledby="studio-contact-title">
    <div className={s.horizon} aria-hidden="true" />
    <div className={s.closingCopy}>
      <h2 id="studio-contact-title">Ide usaha Anda,<br />kita bawa <em>lebih jauh.</em></h2>
      <p>Ceritakan usaha, kebutuhan, dan anggaran Anda. Kita mulai dari hal yang paling berguna untuk pelanggan Anda.</p>
      <div className={s.closingActions}>
        <a href="https://wa.me/6281383521750?text=Halo%20WUUS%2C%20saya%20ingin%20membahas%20website%20usaha." className={s.primary}>Ngobrol lewat WhatsApp <ArrowUpRight size={19} /></a>
        <a href="mailto:hallo@webuntukusaha.com?subject=Diskusi%20website%20usaha">Kirim kebutuhan via email <ArrowUpRight size={17} /></a>
      </div>
    </div>
    <div className={s.footerDirectory}>
      <div><p>Desain dan pengembangan website.<br />Studio independen di Jakarta,<br />untuk seluruh Indonesia.</p><a href="mailto:hallo@webuntukusaha.com">hallo@webuntukusaha.com</a></div>
      <nav aria-label="Jelajahi WUUS"><a href="#services">Layanan</a><a href="#pricing">Harga UMKM</a><a href="#design-catalog">Contoh desain</a><a href="#process">Cara kerja</a><a href="#faq">FAQ</a></nav>
      <nav aria-label="Bacaan dan bahasa"><Link href="/blog">Blog (English)</Link><Link href="/hospitality" lang="en">Hospitality · English</Link><a href="#main">Kembali ke atas <ArrowUpRight size={14} /></a></nav>
    </div>
    <Link href="/" className={s.wordmark} aria-label="WUUS beranda"><BrandArtwork /></Link>
    <div className={s.closingMeta}><span>© {new Date().getFullYear()} WUUS · Web Untuk Usaha</span><span>Jakarta, Indonesia</span><div><Link href="/kebijakan-privasi">Privasi</Link><Link href="/syarat-ketentuan">Ketentuan proyek</Link></div></div>
  </footer>;
}
