import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, FileCheck2, KeyRound, LayoutTemplate, MonitorCheck, Workflow, Wrench } from "lucide-react";
import { MarketingShell, StudioAvatar } from "@/components/marketing/shell";
import { KineticGallery } from "@/components/marketing/kinetic-gallery";
import { SalesHero } from "@/components/marketing/sales-hero";
import { UmkmPricing } from "@/components/marketing/umkm-pricing";
import a from "@/components/marketing/studio-audit.module.css";

const title = "Jasa Website UMKM & Sistem Usaha Mulai Rp750 Ribu | WUUS";
const description = "Website usaha mulai Rp750 ribu untuk UMKM seluruh Indonesia. Cakupan pekerjaan, total biaya, pratinjau dan kepemilikan website dijelaskan sejak awal.";
const socialImage = { url:"/opengraph-image", width:1200, height:630, alt:"WUUS — website dan sistem usaha untuk UMKM seluruh Indonesia" };
export const metadata: Metadata = {
  title, description,
  openGraph: { title:"Website UMKM & Sistem Usaha | WUUS", description, locale:"id_ID", images:[socialImage] },
  twitter: { card:"summary_large_image", title, description, images:[socialImage] },
};
const steps = [
  ["Bahas kebutuhan", "Ceritakan jenis usaha, kebutuhan utama dan anggaran Anda. Jika sudah memiliki website atau alat kerja, sertakan tautannya."],
  ["Setujui penawaran", "Periksa cakupan pekerjaan, total biaya, jadwal dan ketentuan pembayaran. Pengerjaan dimulai setelah uang muka diterima dan materi lengkap."],
  ["Periksa pratinjau", "Coba tampilan dan fungsi melalui tautan pratinjau. Sampaikan masukan dalam tahap revisi yang termasuk dalam paket."],
  ["Peluncuran dan serah terima", "Setelah hasil disetujui dan pembayaran dilunasi, website atau sistem diluncurkan. Anda menerima kode sumber dan panduan penggunaan."],
];
const questions = [
  ["Berapa biaya pembuatan website?", "Website Mulai Rp750.000, Website Tumbuh Rp1.750.000 dan Sistem Satu Alur Rp3.500.000 untuk biaya pengerjaan. Domain, hosting dan biaya wajib lainnya dirinci sebelum uang muka dibayar. Total awal paket UMKM, termasuk biaya wajib tahun pertama, dibatasi Rp4.750.000."],
  ["Berapa lama pengerjaannya?", "Jadwal disepakati dalam penawaran setelah kebutuhan dan kesiapan materi diketahui. Pengerjaan dimulai setelah uang muka diterima dan materi lengkap. Kebutuhan fitur serta tahap revisi ikut menentukan jadwal."],
  ["Bagaimana kalau desainnya belum cocok?", "Anda memeriksa tampilan dan fungsi lewat tautan pratinjau sebelum pelunasan. Sampaikan masukan dalam tahap revisi paket: satu tahap untuk Website Mulai, dua tahap untuk Website Tumbuh dan Sistem Satu Alur. Perubahan di luar cakupan dibahas lebih dahulu."],
  ["Berapa biaya perpanjangan tahun berikutnya?", "Biaya pengerjaan dibayar sekali. Domain, hosting dan layanan lain yang digunakan dapat memiliki biaya perpanjangan sendiri; rinciannya ada dalam penawaran. Pemeliharaan opsional mulai Rp150.000 per bulan, di luar biaya layanan tersebut."],
  ["Bisa memakai domain sendiri atau domain .id?", "Bisa menggunakan domain yang sudah Anda miliki, termasuk .id, selama akses pengaturannya tersedia. Jika belum punya, pilihan domain, ketersediaan dan biayanya dibahas dalam penawaran. Akun domain dan hosting sebaiknya atas nama Anda."],
  ["Apakah website akan muncul di Google?", "Paket website mencakup pengaturan dasar agar halaman mudah dibaca mesin pencari. Pengindeksan dan posisi di hasil pencarian tetap ditentukan Google; WUUS tidak menjanjikan peringkat tertentu."],
  ["Apakah melayani luar Jawa?", "Ya, WUUS melayani UMKM seluruh Indonesia secara jarak jauh. Diskusi, pratinjau, revisi dan serah terima dilakukan secara online."],
  ["Bagaimana kalau belum perlu sistem khusus?", "Kami mulai dari masalah usaha Anda. Jika katalog, formulir atau alat siap pakai sudah cukup, WUUS akan menyarankannya. Sistem khusus hanya dibuat untuk alur yang kebutuhannya sudah jelas."],
  ["Siapa yang menyiapkan materi?", "Anda menyiapkan teks, informasi usaha dan foto yang boleh digunakan. Bantuan penulisan konten atau bahasa tambahan dibahas dalam penawaran."],
  ["Apakah saya bisa mengedit sendiri?", "Fitur mengubah konten sendiri tersedia jika termasuk dalam penawaran. Jika tidak, perubahan konten dapat dibantu WUUS dengan biaya yang disepakati terlebih dahulu."],
  ["Apakah website menjadi milik saya?", "Setelah pelunasan, kode website dan konten sesuai kesepakatan diserahkan kepada Anda. Anda bebas memindahkan website ke hosting lain. Domain dan hosting sebaiknya berada pada akun Anda; ketentuan lisensi aset yang digunakan tetap berlaku."],
];
const services = [
  { title:"Website usaha", text:"Profil, produk, layanan, lokasi, dan kontak. Pelanggan bisa mengenal usaha Anda sebelum menghubungi.", href:"#pricing", action:"Lihat paket website", Icon:LayoutTemplate },
  { title:"Sistem operasional sederhana", text:"Satu alur kerja yang lebih tertata: dari pesanan masuk, status pengerjaan, sampai ringkasannya.", href:"#pricing", action:"Lihat Sistem Satu Alur", Icon:Workflow },
  { title:"Penyempurnaan website", text:"Benahi tampilan di ponsel, susunan informasi, atau kemudahan menghubungi. Cakupan dan harga ditawarkan setelah pemeriksaan.", href:"#contact", action:"Bahas website Anda", Icon:Wrench },
];

export default function Home() {
  return <MarketingShell language="id" experience>
    <main id="main" className={a.page}>
      <SalesHero language="id" />
      <section id="services" className={a.services} aria-labelledby="services-title">
        <div className={a.serviceHead}>
          <div><h2 id="services-title">Yang dibutuhkan usaha Anda,<br />kami bantu buatkan.</h2><p>Mulai dari yang paling berguna untuk pelanggan dan cara kerja Anda. Tidak harus langsung besar.</p></div>
          <div className={a.serviceDiagram} aria-hidden="true"><span>Usaha Anda</span><div><i>Produk</i><i>Layanan</i><i>Kontak</i></div><span>Website yang mudah dipakai</span></div>
        </div>
        <div className={a.serviceRows}>{services.map(({title:serviceTitle,text,href,action,Icon}) => <article key={serviceTitle}><Icon className={a.serviceIcon} aria-hidden="true" /><h3>{serviceTitle}</h3><p>{text}</p><a href={href}>{action}<ArrowUpRight size={17} aria-hidden="true" /></a></article>)}</div>
      </section>
      <UmkmPricing />
      <KineticGallery />
      <section className={a.handover} aria-labelledby="handover-title">
        <div><h2 id="handover-title">Jelas yang dibuat.<br />Jelas yang Anda terima.</h2><p>Website Anda perlu bisa dipakai, dikelola, dan dilanjutkan. Semua dibicarakan sebelum mulai.</p><div className={a.handoverSeal}><KeyRound size={26} aria-hidden="true" /><span>Website milik Anda.<br /><strong>Bebas pindah hosting.</strong></span></div></div>
        <dl>
          <div><dt><FileCheck2 size={20} aria-hidden="true" />Penawaran tertulis</dt><dd>Fitur, halaman, batas revisi, jadwal, serta biaya awal dan perpanjangan disepakati sebelum pengerjaan.</dd></div>
          <div><dt><MonitorCheck size={20} aria-hidden="true" />Hasil bisa diperiksa</dt><dd>Coba tampilan di ponsel dan fungsi sesuai cakupan lewat tautan pratinjau sebelum pelunasan.</dd></div>
          <div><dt><KeyRound size={20} aria-hidden="true" />Website & panduan</dt><dd>Setelah pelunasan, kode dan panduan diserahkan kepada Anda. Akun domain dan hosting sebaiknya milik Anda.</dd></div>
          <div><dt><Wrench size={20} aria-hidden="true" />Dukungan setelah tayang</dt><dd>Perbaikan kesalahan fungsi sesuai kesepakatan selama 14 hari. Perubahan atau pemeliharaan berikutnya dibahas terpisah.</dd></div>
        </dl>
      </section>
      <section id="process" className={a.process} aria-labelledby="process-title">
        <div className={a.processIntro}><h2 id="process-title">Anda bisa mengikuti<br />setiap langkahnya.</h2><p>Berkomunikasi langsung dengan penanggung jawab proyek. Tahu apa yang sedang dikerjakan dan kapan perlu memberi masukan.</p>
          <div className={a.processBoard} role="img" aria-label="Diagram alur kerja WUUS: kebutuhan disepakati, pratinjau diperiksa, lalu website diluncurkan">
            <div className={a.boardHeader}><LayoutTemplate size={20} /><strong>Ruang kerja proyek Anda</strong><span>Ilustrasi alur</span></div>
            <div className={a.boardSteps}><span>Brief disepakati</span><ArrowRight size={18} /><span>Pratinjau</span><ArrowRight size={18} /><span>Peluncuran</span></div>
            <div className={a.projectSheet}><div><span>Rancangan halaman</span><strong>Usaha Anda.<br />Dikenal lebih baik.</strong><i /><i /></div><ul><li><Check size={16} />Informasi usaha</li><li><Check size={16} />Tampilan ponsel</li><li><Check size={16} />Kontak pelanggan</li></ul></div>
            <div className={a.boardFooter}><FileCheck2 size={17} />Penawaran, masukan, dan hasil dalam satu alur.</div>
          </div>
        </div>
        <ol className={a.steps}>{steps.map(([stepTitle,body],index) => <li key={stepTitle}><span>{index+1}</span><div><h3>{stepTitle}</h3><p>{body}</p></div></li>)}</ol>
      </section>
      <section className={a.about} aria-labelledby="about-title"><div className={a.aboutInner}><StudioAvatar /><div><h2 id="about-title">Diskusi langsung<br />dengan yang mengerjakan.</h2><p>WUUS adalah studio website independen yang dijalankan satu orang di Jakarta. Anda bekerja langsung dengan orang yang mendesain dan membangun website.</p><p>Sebelum mulai, Anda tahu apa yang dikerjakan dan berapa biayanya. Selama prosesnya, Anda mendapat kabar perkembangan dan tautan untuk memeriksa hasil. Setelah selesai, kode dan panduannya diserahkan kepada Anda.</p></div></div></section>
      <section id="faq" className={a.faq} aria-labelledby="faq-title"><div><h2 id="faq-title">Sebelum Anda<br />memutuskan.</h2><p>Jawaban untuk hal-hal yang perlu jelas sejak awal.</p><a href="#contact">Masih ada yang ingin ditanyakan?<ArrowUpRight size={18} aria-hidden="true" /></a></div><div className={a.answers}>{questions.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    </main>
  </MarketingShell>;
}
