import type { Metadata } from "next";
import { MarketingShell, StudioAvatar } from "@/components/marketing/shell";
import { KineticGallery } from "@/components/marketing/kinetic-gallery";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { DesignSpotlight } from "@/components/marketing/design-spotlight";
import { SalesHero } from "@/components/marketing/sales-hero";
import { UmkmPricing } from "@/components/marketing/umkm-pricing";
import s from "@/components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Jasa Website UMKM & Sistem Usaha Mulai Rp750 Ribu | WUUS",
  description:
    "Jasa pembuatan website UMKM mulai Rp750 ribu dan sistem operasional sederhana. Melayani seluruh Indonesia dengan cakupan pekerjaan dan total biaya yang disepakati sejak awal.",
  openGraph: {
    title: "Website UMKM & Sistem Usaha | WUUS",
    description:
      "Website mulai Rp750 ribu untuk UMKM seluruh Indonesia. Cakupan pekerjaan, total biaya, pratinjau dan serah terima kode dijelaskan sejak awal.",
    locale: "id_ID",
  },
};
const steps = [
  [
    "Bahas kebutuhan",
    "Ceritakan jenis usaha, kebutuhan utama dan anggaran Anda. Jika sudah memiliki website atau alat kerja, sertakan tautannya.",
  ],
  [
    "Setujui penawaran",
    "Periksa cakupan pekerjaan, total biaya, jadwal dan ketentuan pembayaran. Pengerjaan dimulai setelah uang muka diterima dan materi lengkap.",
  ],
  [
    "Periksa pratinjau",
    "Tinjau tampilan dan fungsi melalui tautan pratinjau. Sampaikan masukan dalam tahap revisi yang termasuk dalam paket.",
  ],
  [
    "Peluncuran dan serah terima",
    "Setelah hasil disetujui dan pembayaran dilunasi, website atau sistem diluncurkan. Anda menerima kode sumber dan panduan penggunaan.",
  ],
];
const questions = [
  [
    "Berapa biaya pembuatan website?",
    "Website Mulai Rp750.000, Website Tumbuh Rp1.750.000 dan Sistem Satu Alur Rp3.500.000 untuk biaya pengerjaan. Domain, hosting dan biaya wajib lainnya dirinci sebelum pembayaran uang muka. Total awal paket UMKM dibatasi Rp4.750.000; kebutuhan disesuaikan dengan anggaran Anda.",
  ],
  ["Apakah melayani luar Jawa?", "Ya, WUUS melayani UMKM seluruh Indonesia secara jarak jauh. Diskusi, pratinjau, revisi dan serah terima dilakukan secara online. Jadwal disepakati setelah kebutuhan dan kesiapan materi diketahui."],
  ["Bagaimana kalau belum perlu sistem khusus?", "Kita mulai dari masalah usaha Anda. Jika katalog, formulir atau alat siap pakai sudah cukup, WUUS akan menyarankannya. Sistem khusus hanya dibuat untuk alur yang kebutuhannya sudah jelas."],
  [
    "Siapa yang menyiapkan materi?",
    "Anda menyiapkan teks, informasi usaha dan foto yang boleh digunakan. Bantuan penulisan konten atau bahasa tambahan dibahas dalam penawaran.",
  ],
  [
    "Apakah saya bisa mengedit sendiri?",
    "Panel pengelolaan konten (CMS) dan fitur edit mandiri tersedia jika termasuk dalam penawaran. Jika tidak, perubahan konten dapat dibantu WUUS dengan biaya yang disepakati terlebih dahulu.",
  ],
  [
    "Apakah website menjadi milik saya?",
    "Kode sumber dan konten sesuai kesepakatan diserahkan setelah pelunasan. Domain dan hosting sebaiknya berada pada akun Anda. Lisensi aset pihak ketiga tetap berlaku.",
  ],
];
export default function Home() {
  return (
    <MarketingShell language="id" experience>
      <main id="main">
        <SalesHero language="id" />
        <DesignSpotlight />
        <div className={`${s.container} ${s.proofLine}`}>
          <span>Nyaman dibuka di ponsel</span>
          <span>Cakupan dan harga tertulis</span>
          <span>Pratinjau sebelum pelunasan</span>
          <span>Serah terima kode website</span>
        </div>
        <section id="services" className={`${s.container} ${s.section} ${s.studioServices}`}>
          <div className={s.sectionHead}>
            <h2>
              Apa yang ingin Anda
              <br />
              benahi di usaha Anda?
            </h2>
            <p>
              Bisa mulai dari website sederhana, katalog produk, atau pencatatan
              pesanan. Kita pilih yang paling dibutuhkan dulu.
            </p>
          </div>
          <div className={s.three}>
            {[
              [
                "Website usaha",
                "Sajikan profil, produk, layanan, lokasi dan kontak dalam satu tempat yang mudah diakses pelanggan.",
              ],
              [
                "Sistem operasional sederhana",
                "Kelola satu alur kerja, seperti pencatatan pesanan, status pengerjaan atau tindak lanjut pelanggan, berdasarkan kebutuhan yang dipetakan bersama.",
              ],
              [
                "Penyempurnaan website",
                "Perbaiki tampilan di ponsel, susunan informasi dan kemudahan menghubungi usaha Anda. Cakupan ditentukan setelah website diperiksa.",
              ],
            ].map(([title, body], index) => (
              <article className={s.feature} key={title}>
                <ServiceIcon
                  kind={
                    index === 0
                      ? "layout"
                      : index === 1
                        ? "message"
                        : "handover"
                  }
                  className={s.serviceIcon}
                />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <UmkmPricing />
        <KineticGallery />
        <section className={`${s.container} ${s.handover}`} aria-labelledby="handover-title">
          <div>
            <h2 id="handover-title">Jelas yang dibuat.<br />Jelas yang Anda terima.</h2>
            <p>Website dipakai untuk menjalankan usaha. Anda perlu tahu cara kerjanya, siapa yang mengelola, dan biaya yang akan datang.</p>
          </div>
          <dl>
            <div><dt>Penawaran tertulis</dt><dd>Fitur, halaman, batas revisi, jadwal, serta biaya awal dan perpanjangan disepakati sebelum pengerjaan.</dd></div>
            <div><dt>Hasil yang bisa diperiksa</dt><dd>Anda mencoba tampilan di ponsel dan fungsi sesuai cakupan lewat tautan pratinjau sebelum pelunasan.</dd></div>
            <div><dt>Kode dan panduan</dt><dd>Kode sumber dan panduan diserahkan setelah pelunasan. Akun domain dan hosting sebaiknya milik Anda.</dd></div>
            <div><dt>Dukungan setelah peluncuran</dt><dd>Perbaikan kesalahan fungsi sesuai kesepakatan selama 14 hari. Perubahan atau pemeliharaan berikutnya dibahas terpisah.</dd></div>
          </dl>
        </section>
        <section
          id="process"
          className={`${s.container} ${s.section} ${s.split}`}
        >
          <div>
            <h2>
              Prosesnya bisa Anda
              <br />
              ikuti dari awal.
            </h2>
            <p>
              Anda berkomunikasi langsung dengan penanggung jawab proyek.
              Kebutuhan materi, batas revisi dan biaya layanan pihak ketiga
              dijelaskan sejak awal.
            </p>
            <div className={s.processPhoto} aria-hidden="true" />
            <p className={s.storyCaption}>Foto ilustratif dibuat dengan AI.</p>
          </div>
          <ol className={s.steps}>
            {steps.map(([title, body], index) => (
              <li key={title}>
                <span className={s.number}>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className={`${s.section} ${s.darkSection}`}>
          <div className={`${s.container} ${s.about}`}>
            <StudioAvatar />
            <div>
              <h2>
                Diskusi langsung
                <br />
                dengan yang mengerjakan.
              </h2>
              <p>
                WUUS adalah studio website independen yang dijalankan satu orang
                di Jakarta. Anda bekerja langsung dengan orang yang mendesain
                dan membangun website.
              </p>
              <p>
                Sebelum mulai, Anda tahu apa yang dikerjakan dan berapa biayanya.
                Selama prosesnya, Anda mendapat kabar perkembangan dan tautan
                untuk memeriksa hasil. Setelah selesai, kode dan panduannya
                diserahkan kepada Anda.
              </p>
            </div>
          </div>
        </section>
        <section id="faq" className={`${s.container} ${s.section} ${s.split}`}>
          <div>
            <h2>Pertanyaan sebelum memulai.</h2>
          </div>
          <div className={s.faq}>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
