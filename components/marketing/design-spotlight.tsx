"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { conceptCatalog } from "@/lib/concept-catalog";
import s from "./design-spotlight.module.css";

const details: Record<string, { headline: string; features: string[] }> = {
  "dapur-saji": { headline: "Dari pilih menu sampai susun pesanan.", features: ["Katalog menu", "Pilihan porsi", "Ringkasan pesanan"] },
  "bersih-laundry": { headline: "Layanan yang jelas, sebelum pakaian dijemput.", features: ["Pilihan layanan", "Estimasi biaya", "Rencana penjemputan"] },
  "ruang-kayu": { headline: "Beri ruang untuk bahan, bentuk, dan detail produk.", features: ["Koleksi furnitur", "Pilihan bahan", "Detail ukuran"] },
  "titik-potong": { headline: "Pelanggan kenal tempatnya sebelum datang.", features: ["Pilihan perawatan", "Profil barber", "Rencana kunjungan"] },
  "putaran-motor": { headline: "Bantu pelanggan memahami kebutuhan servisnya.", features: ["Daftar layanan", "Paket servis", "Ringkasan kebutuhan"] },
  kelopak: { headline: "Pilih bunga untuk momen yang tepat.", features: ["Koleksi buket", "Pilihan ukuran", "Pesan untuk penerima"] },
  "langkah-belajar": { headline: "Temukan kelas yang sesuai, tanpa menebak-nebak.", features: ["Pilihan kelas", "Level belajar", "Pilihan jadwal"] },
  "sela-wear": { headline: "Lihat koleksi. Pilih sampai detailnya.", features: ["Katalog pakaian", "Panduan ukuran", "Tas belanja"] },
};

export function DesignSpotlight() {
  const [index, setIndex] = useState(0);
  const item = conceptCatalog[index], detail = details[item.slug];
  const change = (step: number) => setIndex(current => (current + step + conceptCatalog.length) % conceptCatalog.length);
  const behind = [conceptCatalog[(index + 2) % conceptCatalog.length], conceptCatalog[(index + 1) % conceptCatalog.length]];

  return <section id="examples" className={s.spotlight} aria-labelledby="design-spotlight-title" onKeyDown={event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); change(event.key === "ArrowRight" ? 1 : -1); }
  }}>
    <div className={s.inner}>
      <div className={s.intro}>
        <h2 id="design-spotlight-title">Usahanya berbeda.<br /><span>Websitenya juga.</span></h2>
        <p>Sebuah website perlu terasa seperti usaha Anda. Lihat bagaimana tampilan dan fiturnya bisa punya karakter masing-masing.</p>
        <div className={s.selection} aria-live="polite" aria-atomic="true">
          <span className={s.category}>{item.category}</span>
          <h3>{item.name}</h3>
          <p>{detail.headline}</p>
        </div>
        <ul className={s.features}>{detail.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        <Link href={`/contoh/${item.slug}`} className={s.visit}>Jelajahi websitenya <ArrowUpRight size={19} /></Link>
        <div className={s.controls}>
          <button type="button" onClick={() => change(-1)} aria-label="Contoh sebelumnya"><ArrowLeft size={20} /></button>
          <span className={s.count}>{String(index + 1).padStart(2, "0")} <span>/ {String(conceptCatalog.length).padStart(2, "0")}</span></span>
          <button type="button" onClick={() => change(1)} aria-label="Contoh berikutnya"><ArrowRight size={20} /></button>
        </div>
      </div>
      <div className={s.stage}>
        <div className={s.deck}>
          {behind.map((concept, position) => <div key={`${position}-${concept.slug}`} className={`${s.browser} ${position === 0 ? s.far : s.near}`} aria-hidden="true">
            <div className={s.browserBar}><span className={s.dots}><i /><i /><i /></span><span>{concept.name}</span><span>Contoh desain</span></div>
            <div className={s.image}><Image src={`/images/concepts/${concept.slug}/preview-v2.webp`} alt="" fill sizes="(max-width:700px) 85vw, 55vw" /></div>
          </div>)}
          <Link href={`/contoh/${item.slug}`} className={`${s.browser} ${s.front}`} aria-label={`Buka contoh desain website ${item.name}`}>
            <div className={s.browserBar}><span className={s.dots}><i /><i /><i /></span><span>{item.name}</span><span>Contoh desain <ArrowUpRight size={12} /></span></div>
            <div key={item.slug} className={`${s.image} ${s.activeImage}`}><Image src={`/images/concepts/${item.slug}/preview-v2.webp`} alt={`Tampilan website ${item.name}, contoh desain WUUS`} fill sizes="(max-width:700px) 90vw, 55vw" /></div>
          </Link>
        </div>
        <p className={s.stageCaption}>Contoh desain · Buka untuk mencoba fitur di dalamnya.</p>
      </div>
    </div>
    <div className={s.choices} role="group" aria-label="Pilih contoh desain">
      {conceptCatalog.map((concept, position) => <button key={concept.slug} type="button" aria-pressed={position === index} onClick={() => setIndex(position)}>{concept.name}</button>)}
    </div>
  </section>;
}
