"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ArrowDown, Check, Minus, Plus, ShoppingBag, Leaf, Utensils, Menu, X } from 'lucide-react';
import { menu, formatRupiah, orderSummary } from '@/lib/dapur-saji';
import s from './dapur-saji.module.css';
import {ConceptChoiceGuide, ConceptSectionNavigation, SummaryActions} from './concept-tools';
import {conceptGuides} from './concept-guides';

const categories=['Semua menu','Nasi box','Snack box','Paket berbagi'];
const faqs=[
  ['Bisa pesan untuk berapa orang?', 'Nasi box mulai 10 kotak per menu, snack box mulai 15 kotak, dan paket berbagi mulai 2 paket. Jumlah minimum juga tercantum pada setiap menu.'],
  ['Kapan sebaiknya memesan?', 'Rencanakan pesanan setidaknya tiga hari sebelum acara. Untuk acara besar, bahas menu dan jadwal lebih awal agar semua kebutuhan dapat disiapkan.'],
  ['Bagaimana dengan alergi atau pantangan makanan?', 'Tuliskan bahan yang perlu dihindari pada catatan pesanan. Kebutuhan khusus harus dikonfirmasi terlebih dahulu; makanan tidak otomatis dinyatakan bebas alergen.'],
  ['Apakah harga sudah termasuk ongkir?', 'Harga pada katalog adalah harga makanan. Biaya pengantaran mengikuti alamat dan jadwal, sehingga dihitung setelah rincian pesanan dibahas.'],
  ['Boleh menyesuaikan isi paket?', 'Boleh dibahas. Pilihan lauk, jumlah porsi dan kemasan dapat disesuaikan, dengan harga akhir dikonfirmasi sebelum pesanan disetujui.'],
];

export function DapurSaji() {
  const [category,setCategory]=useState('Semua menu');
  const [quantities,setQuantities]=useState<Record<string,number>>({});
  const [navOpen,setNavOpen]=useState(false);
  const [date,setDate]=useState('');
  const [occasion,setOccasion]=useState('Makan siang kantor');
  const [area,setArea]=useState('');
  const [notes,setNotes]=useState('');
  const [result,setResult]=useState('');
  const [feedback,setFeedback]=useState('');
  const summary=orderSummary(quantities);
  const count=summary.items.reduce((n,i)=>n+i.quantity,0);
  const today=new Date();
  const minDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  function change(id:string,delta:number) {
    const item=menu.find(i=>i.id===id);if(!item)return;
    const current=quantities[id]??0;
    const next=delta>0?(current===0?item.minimum:Math.min(500,current+1)):(current<=item.minimum?0:current-1);
    setQuantities(prev=>({...prev,[id]:next}));setResult('');setFeedback(next?`${item.name}: ${next} ${item.category==='Paket berbagi'?'paket':'kotak'}`:`${item.name} dihapus dari pesanan`);
  }
  const closeNav=()=>setNavOpen(false);
  function makeSummary(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!summary.items.length){setFeedback('Pilih setidaknya satu menu sebelum membuat ringkasan.');return;}
    if(date<minDate){setFeedback('Pilih tanggal hari ini atau sesudahnya.');return;}
    setResult(`Rencana pesanan Dapur Saji\nAcara: ${occasion}\nTanggal: ${date}\nArea: ${area.trim()}\n\n${summary.items.map(i=>`${i.name} × ${i.quantity}: ${formatRupiah(i.subtotal)}`).join('\n')}\n\nSubtotal makanan: ${formatRupiah(summary.total)}\nOngkir dan penyesuaian menu belum dihitung.\nCatatan: ${notes.trim()||'—'}\n\nContoh desain WUUS. Ringkasan hanya dibuat di perangkat ini; tidak ada pesanan yang dikirim.`);
  }
  return <div className={s.site}>
    <ConceptSectionNavigation/>
    <a className={s.skip} href="#utama">Lewati navigasi</a>
    <div className={s.designBar}><Link href="/#examples">WUUS <ArrowUpRight size={13}/></Link><span>Contoh desain</span><Link href="/#contact">Ingin website seperti ini? <ArrowUpRight size={13}/></Link></div>
    <header className={s.header}><div className={s.nav}>
      <a href="#utama" className={s.brand} aria-label="Dapur Saji, beranda"><span className={s.brandMark}><Utensils size={22}/></span>Dapur<span>Saji.</span></a>
      <button type="button" className={s.menuToggle} aria-label={navOpen?'Tutup navigasi':'Buka navigasi'} aria-expanded={navOpen} aria-controls="dapur-nav" onClick={()=>setNavOpen(!navOpen)}>{navOpen?<X/>:<Menu/>}</button>
      <nav id="dapur-nav" className={`${s.links} ${navOpen?s.open:''}`} aria-label="Navigasi Dapur Saji">
        <a href="#menu" onClick={closeNav}>Pilihan menu</a><a href="#cerita" onClick={closeNav}>Dari dapur kami</a><a href="#cara-pesan" onClick={closeNav}>Cara pesan</a><a href="#faq" onClick={closeNav}>Tanya jawab</a>
      </nav>
      <a className={s.navOrder} href="#pesanan" aria-label={`Lihat pesanan, ${count} pilihan`}><ShoppingBag size={18}/><span>Pesanan</span><b>{count}</b></a>
    </div></header>
    <main id="utama">
      <section className={s.hero}>
        <div className={s.heroCopy}><h1>Makanan enak.<br/>Acara jadi<br/><em>lebih hangat.</em></h1><p>Dari makan siang tim sampai kumpul keluarga, pilih hidangan rumahan yang pas untuk meja Anda.</p><div className={s.actions}><a className={s.primary} href="#menu">Lihat pilihan menu <ArrowUpRight size={20}/></a><a className={s.simpleLink} href="#cara-pesan">Bagaimana cara pesannya?</a></div><div className={s.heroFoot}><span><Leaf size={18}/>Menu rumahan</span><span><ShoppingBag size={18}/>Porsi sesuai acara</span></div></div>
        <div className={s.heroPhoto}><Image src="/images/concepts/dapur-saji/hero.webp" alt="Pilihan nasi ayam bakar dengan sayuran, sambal dan kudapan dalam sajian katering" fill priority sizes="(max-width: 800px) 100vw, 58vw"/><div className={s.photoNote}><strong>Ayam bakar,<br/>sambal & cerita.</strong><a href="#menu" aria-label="Lihat menu nasi ayam bakar"><ArrowDown size={20}/></a></div></div>
      </section>
      <div className={s.ribbon}><span>Makan siang kantor</span><i/><span>Rapat & pertemuan</span><i/><span>Kumpul keluarga</span><i/><span>Acara kecil di rumah</span></div>
      <ConceptChoiceGuide {...conceptGuides['dapur-saji']} target="#menu" onChoose={setCategory}/>
      <section id="menu" className={s.section}>
        <div className={s.sectionHeading}><h2>Ada yang pas<br/>untuk acara Anda.</h2><p>Mulai dari satu kotak untuk setiap tamu, sampai hidangan untuk dinikmati bersama. Pilih menu dan atur jumlahnya di bawah.</p></div>
        <div className={s.filters} role="group" aria-label="Kategori menu">{categories.map(c=><button key={c} type="button" aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className={s.menuGrid}>{menu.filter(i=>category==='Semua menu'||i.category===category).map((item)=><article className={s.menuItem} key={item.id}>
          <div className={`${s.menuPhoto} ${s[`photo${item.id}`]}`}><Image src={`/images/concepts/dapur-saji/${item.id}.webp`} alt={item.description} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 45vw, 25vw"/><span>{item.category}</span></div>
          <div className={s.menuInfo}><h3>{item.name}</h3><p>{item.description}</p><div className={s.itemPrice}><strong>{formatRupiah(item.price)}<small> / {item.category==='Paket berbagi'?'paket':'kotak'}</small></strong><span>Min. {item.minimum} {item.category==='Paket berbagi'?'paket':'kotak'}</span></div>
            <div className={s.quantity}>{(quantities[item.id]??0)>0?<><button type="button" aria-label={`Kurangi ${item.name}`} onClick={()=>change(item.id,-1)}><Minus size={17}/></button><output aria-label={`Jumlah ${item.name}`}>{quantities[item.id]}</output><button type="button" disabled={quantities[item.id]>=500} aria-label={`Tambah ${item.name}`} onClick={()=>change(item.id,1)}><Plus size={17}/></button></>:<button type="button" className={s.add} onClick={()=>change(item.id,1)}>Pilih menu <Plus size={17}/></button>}</div>
          </div>
        </article>)}</div>
        <p className={s.menuNote}>Harga per kotak atau paket, belum termasuk pengantaran. Punya pantangan makanan? Catat saat menyusun pesanan.</p><p role="status" className={s.feedback}>{feedback}</p>
      </section>
      <section id="cerita" className={s.story}><div className={s.storyPhoto}><Image src="/images/concepts/dapur-saji/keluarga.webp" alt="Hidangan rumahan untuk dinikmati bersama" fill sizes="(max-width: 800px) 100vw, 50vw"/></div><div className={s.storyText}><span className={s.storyMark}><Utensils size={32}/></span><h2>Yang sederhana,<br/>sering kali<br/>paling dirindukan.</h2><p>Nasi hangat, lauk berbumbu, sayur dan sambal. Dapur Saji membawa rasa yang akrab untuk momen-momen ketika Anda ingin berkumpul tanpa repot menyiapkan semuanya sendiri.</p><p>Mulai dari menu yang Anda suka. Jumlah porsi, pilihan lauk dan kebutuhan acara dibicarakan sebelum pesanan disepakati.</p><a href="#pesanan" className={s.simpleLink}>Susun kebutuhan acara <ArrowRight size={18}/></a></div></section>
      <section id="cara-pesan" className={s.section}><div className={s.sectionHeading}><h2>Anda siapkan acaranya.<br/>Kita susun menunya.</h2><p>Tidak perlu menentukan semua detail sekaligus. Mulai dari pilihan menu dan jumlah tamu.</p></div><ol className={s.steps}>{[['Pilih hidangannya','Lihat isi paket, harga dan jumlah minimum. Tambahkan menu yang cocok untuk acara Anda.'],['Lengkapi rencananya','Tentukan tanggal, area pengantaran dan catatan khusus, lalu periksa ringkasannya.'],['Bahas detail akhirnya','Untuk usaha nyata, ketersediaan jadwal, ongkir dan kebutuhan khusus dikonfirmasi sebelum pembayaran.']].map(([title,description],i)=><li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol></section>
      <section id="pesanan" className={s.orderSection}><div className={s.orderIntro}><ShoppingBag size={28}/><h2>Sudah ada<br/>menu pilihan?</h2><p>Atur jumlah dan lengkapi rencana acaranya. Ringkasan bisa Anda salin untuk diperiksa kembali.</p><div className={s.orderDisclosure}><strong>Contoh desain</strong><p>Pilihan menu dan harga di halaman ini bersifat ilustratif. Ringkasan dibuat di perangkat Anda, tanpa mengirim pesanan atau menerima pembayaran.</p></div></div>
        <form onSubmit={makeSummary} className={s.orderForm}>
          <h3>Rencana pesanan Anda</h3>
          {summary.items.length?<ul className={s.orderItems}>{summary.items.map(item=><li key={item.id}><div><strong>{item.name}</strong><span>{item.quantity} × {formatRupiah(item.price)}</span></div><b>{formatRupiah(item.subtotal)}</b><button type="button" aria-label={`Hapus ${item.name}`} onClick={()=>{setQuantities(q=>({...q,[item.id]:0}));setResult('');}}><X size={17}/></button></li>)}</ul>:<div className={s.emptyOrder}><Utensils size={25}/><p>Belum ada menu yang dipilih.</p><a href="#menu">Lihat pilihan menu <ArrowUpRight size={16}/></a></div>}
          <div className={s.subtotal}><span>Subtotal makanan</span><strong>{formatRupiah(summary.total)}</strong></div><p className={s.excluded}>Belum termasuk ongkir dan penyesuaian menu.</p>
          <div className={s.formRow}><label>Untuk acara apa?<select value={occasion} onChange={e=>{setOccasion(e.target.value);setResult('');}}>{['Makan siang kantor','Rapat atau pertemuan','Acara keluarga','Acara lainnya'].map(v=><option key={v}>{v}</option>)}</select></label><label>Tanggal acara<input required type="date" min={minDate} value={date} onChange={e=>{setDate(e.target.value);setResult('');}}/></label></div>
          <label>Area pengantaran<input required maxLength={120} value={area} placeholder="Contoh: Tebet, Jakarta Selatan" onChange={e=>{setArea(e.target.value);setResult('');}}/></label>
          <label>Catatan tambahan <span>(opsional)</span><textarea maxLength={1000} rows={3} value={notes} placeholder="Waktu makan, pilihan lauk, alergi atau kebutuhan lain" onChange={e=>{setNotes(e.target.value);setResult('');}}/></label>
          <button type="submit" className={s.primary} disabled={!summary.items.length}>Buat ringkasan pesanan <ArrowRight size={18}/></button>
          {result&&<div className={s.result} role="status"><strong><Check size={18}/> Ringkasan siap. Belum ada pesanan yang dikirim.</strong><label htmlFor="ringkasan-pesanan">Ringkasan pesanan</label><textarea id="ringkasan-pesanan" readOnly rows={12} value={result}/><SummaryActions text={result} filename="rencana-dapur-saji"/></div>}
        </form>
      </section>
      <section id="faq" className={`${s.section} ${s.faqSection}`}><div><h2>Sebelum<br/>memesan.</h2><p>Beberapa hal yang biasanya ingin Anda tahu lebih dulu.</p></div><div className={s.faq}>{faqs.map(([question,answer])=><details key={question}><summary>{question}<Plus size={18}/></summary><p>{answer}</p></details>)}</div></section>
      <section className={s.closing}><Leaf size={32}/><h2>Untuk meja yang penuh<br/>makanan dan cerita.</h2><a className={s.primary} href="#menu">Pilih menu Anda <ArrowUpRight size={20}/></a></section>
    </main>
    <footer className={s.footer}><a href="#utama" className={s.brand}>Dapur<span>Saji.</span></a><p>Masakan rumahan, untuk dinikmati bersama.</p><div><Link href="/#examples">Kembali ke contoh desain WUUS</Link><Link href="/#contact">Bahas website untuk usaha Anda <ArrowUpRight size={15}/></Link></div><small>Contoh desain oleh WUUS · Ilustrasi makanan dibuat dengan AI · Tidak terafiliasi dengan usaha katering nyata.</small></footer>
    {count>0&&<a href="#pesanan" className={s.mobileCart}><ShoppingBag size={18}/><span>{count} pilihan · {formatRupiah(summary.total)}</span><ArrowRight size={18}/></a>}
  </div>;
}
