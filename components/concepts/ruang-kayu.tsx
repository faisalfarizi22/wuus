'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, ChevronDown, Ruler, Menu, X } from 'lucide-react';
import { categories, furniture, furnitureSummary, materials, quoteFurniture, rupiah } from '@/lib/ruang-kayu';
import styles from './ruang-kayu.module.css';
import {ConceptChoiceGuide, ConceptSectionNavigation, SummaryActions} from './concept-tools';
import {conceptGuides} from './concept-guides';

function FurnitureFootprint({width, depth, material}: {width:number; depth:number; material:string}) {
  const span = width * 1.12;
  const left = (420 - span) / 2;
  const top = 54;
  const height = depth * .9;
  return <figure className={styles.footprint}>
    <svg viewBox="0 0 420 202" role="img" aria-label={`Tampak atas meja, panjang ${width} sentimeter dan lebar ${depth} sentimeter`}>
      <rect className={styles[`wood_${material}`]} x={left} y={top} width={span} height={height} rx="2"/>
      <path d={`M${left} 30v12 M${left} 36h${span} M${left+span} 30v12`} fill="none"/>
      <text x="210" y="25" textAnchor="middle">{width} cm</text>
      <path d={`M${left+span+10} ${top}h12 M${left+span+16} ${top}v${height} M${left+span+10} ${top+height}h12`} fill="none"/>
      <text x={left+span+26} y={top+height/2+4}>{depth} cm</text>
    </svg>
    <figcaption>Jejak meja · tampak atas, tanpa ruang kursi.</figcaption>
  </figure>;
}

export function RuangKayu() {
  const [navOpen, setNavOpen] = useState(false);
  const [category, setCategory] = useState<string>('Semua');
  const [productId, setProductId] = useState('aruna');
  const [materialId, setMaterialId] = useState('sungkai');
  const [width, setWidth] = useState('160');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const selected = furniture.find(item => item.id === productId)!;
  const config = { productId, materialId, width: Number(width), quantity: Number(quantity) };
  const quote = quoteFurniture(config);
  function chooseProduct(id: string) {
    const item = furniture.find(product => product.id === id)!;
    setProductId(id); setWidth(String(item.width)); setSummary(''); setCopyStatus('');
  }
  function invalidate() { setSummary(''); setCopyStatus(''); }
  return <div className={styles.site}>
    <ConceptSectionNavigation/>
    <a className={styles.skip} href="#konten-ruang">Lewati ke konten</a>
    <div className={styles.demo}><span>Contoh desain WUUS <span className={styles.demoDetail}>· Brand, foto AI & harga ilustratif</span></span><Link href="/">Kembali ke WUUS <ArrowUpRight size={13} /></Link></div>
    <header className={styles.header}>
      <a href="#" className={styles.logo} aria-label="Ruang Kayu, ke atas">ruang<span>kayu</span><i /></a>
      <nav aria-label="Navigasi Ruang Kayu" id="ruang-kayu-navigation" className={navOpen?styles.navOpen:undefined}><a href="#koleksi" onClick={()=>setNavOpen(false)}>Koleksi</a><a href="#material" onClick={()=>setNavOpen(false)}>Material & cerita</a><a href="#proses" onClick={()=>setNavOpen(false)}>Cara memesan</a></nav>
      <a href="#rancang" className={styles.headerCta} onClick={()=>setNavOpen(false)}>Rancang milikmu <ArrowUpRight size={16} /></a><button className={styles.menuToggle} type="button" aria-label={navOpen?'Tutup navigasi':'Buka navigasi'} aria-expanded={navOpen} aria-controls="ruang-kayu-navigation" onClick={()=>setNavOpen(!navOpen)}>{navOpen?<X size={20}/>:<Menu size={20}/>}</button>
    </header>
    <main id="konten-ruang">
      <section className={styles.hero} aria-labelledby="ruang-title">
        <Image src="/images/concepts/ruang-kayu/hero.webp" alt="Ilustrasi interior hangat dengan furniture kayu dan cahaya alami" fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}><h1 id="ruang-title">Ruang untuk<br />cerita yang<br /><em>bertumbuh.</em></h1><p>Furniture dengan karakter alami.<br />Dirancang mengikuti ruang dan ritme hidupmu.</p><a href="#koleksi" className={styles.lightButton}>Temukan koleksimu <ArrowUpRight size={20} /></a></div>
        <div className={styles.heroCaption}><span>Kayu. Cahaya. Kehidupan.</span><span>Koleksi konsep / 2026</span></div>
        <a href="#material" className={styles.heroNote}><span>Keindahan ada<br />pada detailnya.</span><ArrowUpRight size={22} /></a>
      </section>
      <div className={styles.philosophy}><p>Bukan sekadar mengisi ruang.<br /><span>Membuatnya terasa seperti rumah.</span></p><div>Serat yang berbeda pada setiap bidang.<br />Bentuk sederhana untuk dipakai setiap hari.</div></div>
      <ConceptChoiceGuide {...conceptGuides['ruang-kayu']} target="#rancang" onChoose={chooseProduct}/>
      <section id="koleksi" className={styles.collection} aria-labelledby="koleksi-title">
        <div className={styles.sectionHead}><h2 id="koleksi-title">Temukan tempatnya.</h2><p>Satu keluarga bentuk.<br />Berbagai cara menikmati ruang.</p></div>
        <div className={styles.filters} role="group" aria-label="Filter koleksi">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <p className={styles.srOnly} aria-live="polite">{furniture.filter(item => category === 'Semua' || item.category === category).length} koleksi ditampilkan</p>
        <div className={styles.products}>{furniture.filter(item => category === 'Semua' || item.category === category).map((item, index) => <article className={styles.product} key={item.id}>
          <a href="#rancang" onClick={() => chooseProduct(item.id)} className={`${styles.productImage} ${styles[item.id]}`} aria-label={`Atur ${item.name}`}><Image src={`/images/concepts/ruang-kayu/${item.id==='aruna'?'product':item.id}.webp`} alt={`Ilustrasi keluarga meja kayu untuk ${item.category.toLowerCase()}; model aktual mengikuti konfigurasi`} fill sizes="(max-width: 700px) 100vw, 33vw" /><span>{item.category}</span><i><ArrowUpRight size={22} /></i></a>
          <div className={styles.productHeading}><h3>{item.name}</h3><span>0{furniture.findIndex(product => product.id === item.id) + 1}</span></div><p>{item.description}</p><div className={styles.productPrice}><span>Mulai {rupiah(item.basePrice)}</span><a href="#rancang" onClick={() => chooseProduct(item.id)}>Atur ukuran <ArrowRight size={15} /></a></div>{index === 0 && <span className={styles.srOnly}>Semua harga pada halaman ini adalah ilustrasi.</span>}
        </article>)}</div>
        <p className={styles.photoNote}>Visual AI menunjukkan bahasa desain koleksi, bukan foto produk siap jual. Harga adalah simulasi.</p>
      </section>
      <section className={styles.story} id="material" aria-labelledby="material-title"><div className={styles.detailImage}><Image src="/images/concepts/ruang-kayu/detail.webp" alt="Ilustrasi detail serat dan sambungan furniture kayu" fill sizes="(max-width: 700px) 100vw, 50vw" /><span>Biarkan materialnya bicara.</span></div><div className={styles.storyCopy}><h2 id="material-title">Ada kehidupan<br />di setiap serat.</h2><p>Warna yang tidak seragam. Garis yang tidak berulang. Justru di sanalah kayu menemukan karakternya.</p><p>Dalam konsep ini, material dan ukuran bisa dipilih sejak awal. Supaya bentuk yang kamu sukai juga cocok dengan cara kamu hidup.</p><div className={styles.materialList}>{materials.map(material => <div key={material.id}><span className={`${styles.swatch} ${styles[material.id]}`} /><span><strong>{material.name}</strong><small>{material.note}</small></span></div>)}</div></div></section>
      <section id="rancang" className={styles.configure} aria-labelledby="rancang-title"><div className={styles.configIntro}><Ruler size={28} strokeWidth={1.3} /><h2 id="rancang-title">Ukuran ruangmu.<br /><em>Pilihanmu.</em></h2><p>Mulai dari satu meja. Pilih karakter kayu dan panjang yang pas, lalu simpan ringkasan kebutuhanmu.</p><div className={styles.dimension}><span>{selected.name}</span><strong>{width || '—'} <small>× {selected.depth} × {selected.height} cm</small></strong><span>Panjang × lebar × tinggi</span></div>{quote.ok&&<FurnitureFootprint width={quote.width} depth={quote.product.depth} material={materialId}/>}<p className={styles.configNote}>Simulasi ini bekerja di perangkatmu. Tidak ada data yang dikirim dan tidak ada pesanan dibuat.</p></div>
        <form className={styles.configForm} onSubmit={event => { event.preventDefault(); if (quote.ok) { setSummary(furnitureSummary(config, note)); setCopyStatus('Ringkasan siap disalin. Belum dikirim ke siapa pun.'); } }}>
          <label htmlFor="rk-product">Pilih koleksi</label><div className={styles.selectWrap}><select id="rk-product" value={productId} onChange={event => chooseProduct(event.target.value)}>{furniture.map(item => <option value={item.id} key={item.id}>{item.name} — {item.category}</option>)}</select><ChevronDown size={17} /></div>
          <fieldset><legend>Karakter material</legend><div className={styles.materialOptions}>{materials.map(item => <label key={item.id}><input type="radio" name="rk-material" value={item.id} checked={materialId === item.id} onChange={() => { setMaterialId(item.id); invalidate(); }} /><span className={`${styles.swatch} ${styles[item.id]}`} /><span>{item.name}</span></label>)}</div></fieldset>
          <div className={styles.inputRow}><div><label htmlFor="rk-width">Panjang (cm)</label><input id="rk-width" type="number" min={selected.min} max={selected.max} step={10} required value={width} onChange={event => { setWidth(event.target.value); invalidate(); }} aria-describedby="rk-width-help" /><small id="rk-width-help">{selected.min}–{selected.max} cm · kelipatan 10</small></div><div><label htmlFor="rk-quantity">Jumlah unit</label><input id="rk-quantity" type="number" min={1} max={10} step={1} required value={quantity} onChange={event => { setQuantity(event.target.value); invalidate(); }} /><small>1–10 unit</small></div></div>
          <label htmlFor="rk-note">Catatan ruang <span>(opsional)</span></label><textarea id="rk-note" maxLength={500} rows={2} value={note} placeholder="Misalnya: untuk ruang makan 3 × 4 meter" onChange={event => { setNote(event.target.value); invalidate(); }} />
          <div className={styles.quote} aria-live="polite">{quote.ok ? <><span>Estimasi total <small>{quote.quantity} unit × {rupiah(quote.unitPrice)}</small></span><strong>{rupiah(quote.total)}</strong></> : <p role="alert">{quote.error}</p>}</div><p className={styles.finePrint}>Harga ilustratif. Belum termasuk pengiriman dan pemasangan. Bukan penawaran final.</p><button type="submit" className={styles.darkButton} disabled={!quote.ok}>Buat ringkasan kebutuhan <ArrowUpRight size={20} /></button>
          {summary && <div className={styles.summary}><div><h3>Ringkasan kebutuhanmu</h3><button type="button" onClick={() => { setSummary(''); setCopyStatus(''); }} aria-label="Tutup ringkasan"><X size={18} /></button></div><label htmlFor="rk-summary" className={styles.srOnly}>Teks ringkasan untuk disalin manual</label><textarea id="rk-summary" readOnly value={summary} rows={9} /><SummaryActions text={summary} filename="rencana-ruang-kayu"/></div>}
          <p className={styles.copyStatus} role="status">{copyStatus}</p>
        </form>
      </section>
      <section className={styles.process} id="proses" aria-labelledby="proses-title"><div className={styles.sectionHead}><h2 id="proses-title">Dari ide,<br />menjadi bagian rumah.</h2><p>Gambaran alur pemesanan<br />untuk usaha furniture.</p></div><ol>{[{title:'Ceritakan ruangmu',text:'Pilih koleksi, ukuran, dan material. Tambahkan catatan tentang ruangan dan cara pemakaiannya.'},{title:'Sepakati detailnya',text:'Usaha meninjau ukuran, finishing, biaya, dan jadwal. Produksi dimulai setelah spesifikasi disetujui.'},{title:'Sambut di rumah',text:'Pengiriman dan pemasangan dibahas sesuai lokasi serta akses ruangan.'}].map(item => <li key={item.title}><span><Check size={19} /></span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol></section>
      <section className={styles.faq} aria-labelledby="faq-title"><h2 id="faq-title">Sebelum memilih.</h2><div>{[{q:'Apakah ini toko furniture sungguhan?',a:'Ruang Kayu adalah contoh desain website oleh WUUS. Brand, produk, foto AI, dan harga di halaman ini bersifat ilustratif. Tidak ada transaksi atau pesanan yang diproses.'},{q:'Bagaimana kalau ukuran saya di luar pilihan?',a:'Konfigurator membatasi ukuran untuk menjaga simulasi tetap masuk akal. Pada website usaha nyata, ukuran di luar pilihan perlu konsultasi konstruksi dan penawaran khusus.'},{q:'Apakah warna kayu akan persis seperti foto?',a:'Tidak. Foto di sini adalah ilustrasi AI. Pada produksi nyata, serat, warna kayu, pencahayaan, dan finishing dapat menghasilkan tampilan berbeda. Sampel material sebaiknya disepakati lebih dahulu.'},{q:'Ke mana ringkasan kebutuhan saya dikirim?',a:'Ringkasan hanya muncul di halaman dan dapat kamu salin. Tidak dikirim ke WhatsApp, email, server, atau pihak lain. Muat ulang halaman akan menghapus pilihanmu.'}].map(item => <details key={item.q}><summary>{item.q}<ChevronDown size={19} /></summary><p>{item.a}</p></details>)}</div></section>
      <section className={styles.closing}><h2>Setiap ruang punya cerita.<br /><em>Mulai dari milikmu.</em></h2><a href="#rancang" className={styles.lightButton}>Rancang pilihanmu <ArrowUpRight size={22} /></a></section>
    </main>
    <footer className={styles.footer}><a href="#" className={styles.logo}>ruang<span>kayu</span><i /></a><p>Furniture untuk hidup yang terasa dekat.</p><div><span>Contoh desain oleh WUUS · 2026</span><Link href="/">Lihat WUUS <ArrowUpRight size={14} /></Link></div></footer>
  </div>;
}
