// Owner-approved direction, 16 October 2026. Indonesian UMKM only.
export const umkmOffers = [
  {
    id: "mulai",
    name: "Website Mulai",
    price: 750_000,
    description: "Hadirkan informasi usaha dan kontak pelanggan dalam satu halaman.",
    features: [
      "1 halaman, hingga 6 bagian",
      "Profil, layanan, lokasi dan tombol WhatsApp",
      "Hingga 10 produk atau layanan dari materi Anda",
      "Tampilan untuk ponsel dan pengaturan dasar SEO",
      "1 tahap revisi, file website dan panduan penggunaan",
    ],
  },
  {
    id: "tumbuh",
    name: "Website Tumbuh",
    price: 1_750_000,
    description: "Tampilkan katalog dan informasi usaha dalam website yang lebih lengkap.",
    features: [
      "Hingga 5 halaman dan 20 produk atau layanan",
      "Profil, katalog, galeri, FAQ dan kontak",
      "Tombol WhatsApp untuk pertanyaan tentang produk",
      "Tampilan untuk ponsel dan pengaturan dasar SEO",
      "2 tahap revisi, file website dan panduan penggunaan",
    ],
  },
  {
    id: "alur",
    name: "Sistem Satu Alur",
    price: 3_500_000,
    description: "Kelola satu alur kerja agar pencatatan dan pemantauan lebih teratur.",
    features: [
      "Pemetaan kebutuhan dan rancangan awal sebelum pengembangan",
      "1 alur: misalnya pesanan masuk → status → ringkasan",
      "Akses staf dengan 1 tingkat izin, hingga 3 pengguna",
      "Ekspor data CSV, panduan pencadangan dan pengujian bersama",
      "2 tahap revisi, file sistem dan panduan penggunaan",
    ],
  },
] as const;

export const umkmInitialBudgetCeiling = 4_750_000;

export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(value);
}

export function umkmInquiry(offer: (typeof umkmOffers)[number]) {
  const message = `Halo WUUS, saya ingin membahas ${offer.name} (biaya pengerjaan ${rupiah(offer.price)}).\n\nJenis usaha:\nKota/provinsi:\nKebutuhan utama:`;
  return `https://wa.me/6281383521750?text=${encodeURIComponent(message)}`;
}

export function umkmGeneralInquiry() {
  const message = "Halo WUUS, saya ingin membahas kebutuhan website atau sistem untuk usaha saya.\n\nJenis usaha:\nKota/provinsi:\nKebutuhan utama:";
  return `https://wa.me/6281383521750?text=${encodeURIComponent(message)}`;
}
