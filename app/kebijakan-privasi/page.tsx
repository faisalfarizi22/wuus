import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/shell";
import s from "@/components/marketing/marketing.module.css";
export const metadata: Metadata = {
  title: "Informasi privasi | WUUS",
  alternates: { canonical: "https://webuntukusaha.com/kebijakan-privasi" },
};
const sections = [
  [
    "Siapa yang menangani permintaan Anda",
    "WUUS adalah studio website independen di Jakarta, Indonesia. Hubungi hallo@webuntukusaha.com untuk pertanyaan tentang informasi pribadi atau pemberitahuan ini.",
  ],
  [
    "Informasi yang Anda kirim",
    "Form review mengumpulkan nama usaha atau properti, tautan online, nama kontak, email, pesan dan jenis permintaan untuk membalas, menyiapkan review dan membahas proyek. ID permintaan, sumber, waktu dan versi persetujuan juga dicatat. Chat website menyimpan isi percakapan, waktu, status balasan dan persetujuan Anda. Jika Anda memilih email atau WhatsApp, layanan tersebut menangani pesan yang Anda kirim. Jangan sertakan data pelanggan, kata sandi, PIN, detail kartu pembayaran atau dokumen identitas dalam pesan.",
  ],
  [
    "Pengamanan dan layanan yang digunakan",
    "Website menggunakan Vercel untuk hosting, Supabase untuk penyimpanan permintaan dan percakapan serta login pengelola, Resend untuk notifikasi pengelola, serta Vercel Analytics dan Speed Insights untuk informasi trafik dan performa. Cookie percakapan yang hanya dapat dibaca server berlaku hingga tujuh hari agar Anda dapat kembali ke chat pada browser yang sama. Draft pesan disimpan sementara di tab browser sampai pengiriman dikonfirmasi atau sesi tab berakhir. Hash berkunci dari alamat jaringan dipakai untuk membatasi pengiriman berulang. Penyedia hosting dapat memproses log teknis untuk operasi dan keamanan website. Penyedia proyek atau pembayaran tambahan dijelaskan sebelum proyek berbayar dimulai.",
  ],
  [
    "Lokasi pemrosesan",
    "WUUS menangani permintaan dari Indonesia. Infrastruktur penyedia layanan dapat berada di luar negara Anda. Hubungi WUUS untuk informasi pengaturan penyedia dan proyek yang relevan dengan permintaan Anda.",
  ],
  [
    "Penyimpanan dan permintaan data",
    "Pengelola meninjau permintaan dan percakapan calon pelanggan yang tidak aktif setelah 90 hari untuk penghapusan; pemeriksaan ini dilakukan secara manual. Korespondensi proyek aktif dan catatan yang diperlukan untuk pembukuan disimpan sesuai kebutuhan proyek dan periode pencatatan yang berlaku. Catatan pembatasan jaringan dibersihkan dalam pemeliharaan rutin setelah tidak diperlukan. Anda dapat meminta salinan, koreksi, penghapusan atau penghentian kontak melalui email bisnis. WUUS memeriksa permintaan dan menjelaskan bila ada catatan yang harus disimpan.",
  ],
  [
    "Contoh desain dan bantuan AI",
    "Nama usaha dan isi pada contoh desain bersifat fiktif. Interaksi pada contoh desain tidak mengirim pesanan atau pembayaran. Untuk chat WUUS, tim dapat menggunakan bantuan Maya, asisten AI, saat sesi kerja Codex aktif. Konteks percakapan yang diperlukan dapat diproses melalui sesi tersebut untuk menyiapkan balasan. Balasan tidak selalu langsung tersedia; tidak ada layanan otomatis 24 jam yang dijanjikan. Data percakapan tidak ditampilkan sebagai materi promosi.",
  ],
];
export default function PrivacyPage() {
  return (
    <MarketingShell language="id">
      <main id="main" className={`${s.container} ${s.legal}`}>
        <h1>Informasi privasi</h1>
        <p>Diperbarui 19 Oktober 2026</p>
        <div className="mt-10 space-y-8">
          {sections.map(([title, content]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p className="mt-3">{content}</p>
            </section>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/syarat-ketentuan">Ketentuan proyek</Link> ·{" "}
          <Link href="/hospitality/privacy" lang="en">
            English version
          </Link>
        </p>
      </main>
    </MarketingShell>
  );
}
