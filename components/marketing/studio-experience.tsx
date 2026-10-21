"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, Monitor, Smartphone } from "lucide-react";
import { BrandArtwork } from "./brand-artwork";
import { StudioHeader } from "./studio-header";
import { umkmGeneralInquiry } from "@/lib/umkm-offers";
import base from "./marketing.module.css";
import s from "./studio-experience.module.css";

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
  return <section ref={section} className={s.hero} data-visible="true" aria-labelledby="studio-hero-title">
    <div className={s.heroInner}>
      <div className={s.heroCopy}>
        <h1 id="studio-hero-title">Website usaha.<br /><span>Mulai Rp750 ribu.</span></h1>
        <p>Biar pelanggan mudah melihat produk, mengenal layanan, dan menghubungi Anda. Kami bantu buatkan website yang enak dilihat dan mudah dipakai.</p>
        <div className={s.heroActions}>
          <a href={umkmGeneralInquiry()} className={s.primary}><MessageCircle size={19} aria-hidden="true" /> Konsultasi via WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href="#pricing" className={s.secondary}>Lihat paket & biaya <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <p className={s.heroNote}>Biaya pengerjaan sekali bayar. Cakupan dan total biaya disepakati sebelum mulai.</p>
      </div>
      <div className={s.world}>
        <div className={s.designBoard} aria-hidden="true">
          <svg viewBox="0 0 560 500" className={s.planLines} fill="none"><path d="M38 100H520M38 400H520M70 35V466M490 35V466" stroke="currentColor" strokeWidth="1" /><path d="M38 95V105M510 95V105M65 35H75M65 466H75" stroke="currentColor" strokeWidth="2" /><rect x="83" y="115" width="394" height="265" rx="8" stroke="currentColor" strokeDasharray="5 7" /><path d="M150 365H430M425 360L430 365L425 370" stroke="currentColor" /></svg>
          <span className={s.boardTop}><Monitor size={16} /> Dirancang untuk usaha Anda</span>
          <span className={s.boardSide}>Tampilan → fungsi → siap dipakai</span>
        </div>
        <Link href="/contoh/dapur-saji" className={s.desktopSample} aria-label="Coba website contoh Dapur Saji">
          <span className={s.browserBar}><span><i /><i /><i /></span><span>Dapur Saji · Contoh desain</span><ArrowUpRight size={14} /></span>
          <span className={s.sampleImage}><Image src="/images/concepts/dapur-saji/preview-v2.webp" alt="Contoh tampilan website katering Dapur Saji" fill sizes="(max-width:600px) 68vw, (max-width:1000px) 42vw, 440px" /></span>
        </Link>
        <div className={s.mobileSample} aria-hidden="true"><span className={s.phoneSpeaker} /><div className={s.phoneContent}><span>Usaha Anda</span><strong>Produk pilihan.<br />Mudah ditemukan.</strong><div className={s.productBlocks}><i /><i /><i /></div><span className={s.phoneContact}><MessageCircle size={13} /> Hubungi usaha</span></div><span className={s.phoneLabel}><Smartphone size={13} /> Nyaman di ponsel</span></div>
        <div className={s.planetFloat}>
          <button type="button" className={s.planet} aria-label="Sapa teman studio WUUS" onClick={() => setGreeting(value => (value + 1) % greetings.length)}>
            <Image src="/images/studio/wuus-orbit-v2.webp" alt="Teman studio WUUS, globe keramik dengan orbit amber" width={720} height={720} priority sizes="(max-width:600px) 230px, (max-width:1000px) 280px, 360px" />
          </button>
        </div>
        <p className={s.greeting} aria-live="polite">{greetings[greeting]}</p>
        <a className={s.sampleLink} href="#examples">Lihat semua contoh desain <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
    <div className={s.trustStrip} aria-label="Cara WUUS mengerjakan website">
      {["Cakupan dan harga tertulis", "Pratinjau sebelum pelunasan", "Website dan panduan diserahkan"].map(item => <span key={item}><Check size={17} aria-hidden="true" />{item}</span>)}
      <span className={s.indonesia}>Dari Jakarta, untuk seluruh Indonesia.</span>
    </div>
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
