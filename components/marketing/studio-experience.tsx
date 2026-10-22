"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChartNoAxesColumnIncreasing, LayoutPanelTop, PanelsTopLeft } from "lucide-react";
import { BrandArtwork } from "./brand-artwork";
import { StudioHeader } from "./studio-header";
import { umkmGeneralInquiry } from "@/lib/umkm-offers";
import base from "./marketing.module.css";
import s from "./studio-experience.module.css";
import h from "./studio-hero.module.css";

export function StudioExperience({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const visibility = () => { if (root.current) root.current.dataset.motion = document.hidden ? "paused" : "active"; };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  return <div ref={root} lang="id" className={[base.site, base.experience, s.experience].join(" ")} data-wuus-tone={night ? "night" : "day"}>
    <StudioHeader night={night} onToggleNight={() => setNight(value => !value)} />
    {children}
  </div>;
}

const greetings = ["Website yang pas untuk usaha Anda.", "Lihat contohnya. Coba fiturnya.", "Mulai dari yang paling Anda butuhkan."];

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
  return <section ref={section} className={h.hero} data-visible="true" aria-labelledby="studio-hero-title">
    <svg className={h.landscape} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wuus-paper-back" x1="950" y1="280" x2="1430" y2="860" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hero-fold-light)" /><stop offset="1" stopColor="var(--hero-fold-deep)" /></linearGradient>
        <linearGradient id="wuus-paper-front" x1="870" y1="520" x2="1150" y2="870" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hero-fold-light)" /><stop offset=".58" stopColor="var(--hero-fold-mid)" /><stop offset="1" stopColor="var(--hero-fold-light)" /></linearGradient>
      </defs>
      <path d="M760 900C1090 720 994 253 1257 154C1346 121 1400 104 1500 28V900Z" fill="url(#wuus-paper-back)" />
      <path d="M760 900C1090 720 994 253 1257 154C1346 121 1400 104 1500 28" stroke="var(--hero-seam)" strokeWidth="2" />
      <path d="M445 925C794 804 982 750 1152 624C1292 521 1360 440 1500 455V925Z" fill="url(#wuus-paper-front)" />
      <path d="M445 925C794 804 982 750 1152 624C1292 521 1360 440 1500 455" stroke="var(--hero-seam)" strokeWidth="2" />
      <path d="M784 920C1120 861 1319 782 1500 668" stroke="var(--hero-seam)" strokeWidth="2" />
      <path d="M0 786C113 820 128 880 221 925H0Z" fill="var(--hero-fold-mid)" opacity=".45" />
    </svg>
    <div className={h.inner}>
      <div className={h.copy}>
        <h1 id="studio-hero-title">Website usaha.<br /><span>Mulai Rp750 ribu.</span></h1>
        <p>Biar pelanggan mudah melihat produk, mengenal layanan, dan menghubungi Anda. Kami bantu buatkan website yang enak dilihat dan mudah dipakai.</p>
        <div className={h.actions}>
          <a href={umkmGeneralInquiry()} className={h.primary}>Konsultasi via WhatsApp <span><ArrowUpRight size={22} aria-hidden="true" /></span></a>
          <a href="#pricing" className={h.price}><span><strong>Lihat paket & biaya</strong></span><ArrowUpRight size={19} aria-hidden="true" /></a>
        </div>
        <p className={h.note}>Biaya pengerjaan sekali bayar. Cakupan dan total biaya disepakati sebelum mulai.</p>
      </div>
      <div className={h.world}>
        <div className={h.halo} aria-hidden="true" />
        <svg className={h.orbits} viewBox="0 0 720 720" fill="none" aria-hidden="true">
          <ellipse cx="360" cy="355" rx="335" ry="208" transform="rotate(-33 360 355)" stroke="var(--hero-orbit)" strokeWidth="1" />
          <ellipse cx="360" cy="355" rx="328" ry="225" transform="rotate(33 360 355)" stroke="var(--hero-orbit)" strokeWidth="1" strokeDasharray="2 7" />
          <ellipse cx="360" cy="359" rx="347" ry="192" transform="rotate(-12 360 359)" stroke="var(--hero-seam)" strokeWidth="1.5" />
        </svg>
        <div className={h.pedestal} aria-hidden="true"><i /><span /></div>
        <div className={h.planetFloat}>
          <button type="button" className={h.planet} data-wuus-sound="mascot" aria-label="Sapa teman studio WUUS" onClick={() => setGreeting(value => (value + 1) % greetings.length)}>
            <Image src="/images/studio/wuus-orbit-v2.webp" alt="Teman studio WUUS, globe keramik dengan orbit amber" width={960} height={960} priority sizes="(max-width:600px) 96vw, (max-width:999px) 560px, (max-width:1600px) 53vw, 780px" />
          </button>
        </div>
        <div className={h.browserTile} aria-hidden="true"><PanelsTopLeft size={36} strokeWidth={1.8} /></div>
        <div className={h.chartTile} aria-hidden="true"><ChartNoAxesColumnIncreasing size={36} strokeWidth={2.6} /></div>
        <div className={h.layoutTile} aria-hidden="true"><LayoutPanelTop size={37} strokeWidth={1.8} /></div>
        <i className={h.goldOne} aria-hidden="true" /><i className={h.goldTwo} aria-hidden="true" /><i className={h.pearlOne} aria-hidden="true" /><i className={h.pearlTwo} aria-hidden="true" />
        <p className={h.greeting} aria-live="polite"><svg className={h.spark} viewBox="0 0 32 36" fill="none" aria-hidden="true"><path d="M24 12L20 2M16 20L4 13M15 29L2 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>{greetings[greeting]}</p>
      </div>
    </div>
    <div className={h.bottom}><span><i aria-hidden="true" />Website. Katalog. Sistem usaha.</span><a href="#examples">Jelajahi WUUS <ArrowDown size={17} aria-hidden="true" /></a><span>Jakarta · Seluruh Indonesia</span></div>
  </section>;
}

export function StudioClosing() {
  return <footer id="contact" className={s.closing} aria-labelledby="studio-contact-title">
    <div className={s.horizon} aria-hidden="true" />
    <div className={s.closingCopy}>
      <h2 id="studio-contact-title">Ceritakan usaha Anda.<br /><em>Kami bantu petakan kebutuhannya.</em></h2>
      <p>Cukup kirim jenis usaha, kota, dan kebutuhan utama. Setelah dibahas, Anda menerima penawaran tertulis berisi cakupan, jadwal, dan total biaya.</p>
      <div className={s.closingActions}>
        <a href={umkmGeneralInquiry()} className={s.primary}>Kirim 3 info lewat WhatsApp <ArrowUpRight size={19} aria-hidden="true" /></a>
        <a href="mailto:hallo@webuntukusaha.com?subject=Diskusi%20website%20usaha">Atau lewat email <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </div>
    <div className={s.footerDirectory}>
      <div><p>Desain dan pengembangan website.<br />Studio independen di Jakarta,<br />untuk seluruh Indonesia.</p><a href="mailto:hallo@webuntukusaha.com">hallo@webuntukusaha.com</a></div>
      <nav aria-label="Jelajahi WUUS"><a href="#services">Layanan</a><a href="#pricing">Harga UMKM</a><a href="#examples">Contoh desain</a><a href="#process">Cara kerja</a><a href="#faq">FAQ</a></nav>
      <nav aria-label="Untuk pengunjung berbahasa Inggris"><span className={s.audienceLabel}>Untuk audiens internasional</span><Link href="/hospitality" lang="en">Hospitality · English <ArrowUpRight size={14} aria-hidden="true" /></Link><Link href="/blog" lang="en">Artikel berbahasa Inggris</Link><a href="#main">Kembali ke atas <ArrowUpRight size={14} aria-hidden="true" /></a></nav>
    </div>
    <Link href="/" className={s.wordmark} aria-label="WUUS beranda"><BrandArtwork /></Link>
    <div className={s.closingMeta}><span>© {new Date().getFullYear()} WUUS · Web Untuk Usaha</span><span>Jakarta, Indonesia</span><div><Link href="/kebijakan-privasi">Privasi</Link><Link href="/syarat-ketentuan">Ketentuan proyek</Link></div></div>
  </footer>;
}
