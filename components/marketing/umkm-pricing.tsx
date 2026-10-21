import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { rupiah, umkmOffers, umkmInquiry, umkmInitialBudgetCeiling } from "@/lib/umkm-offers";
import s from "./marketing.module.css";
import p from "./umkm-pricing.module.css";

export function UmkmPricing() {
  return (
    <section id="pricing" className={`${s.section} ${p.pricing}`} aria-labelledby="umkm-pricing-title">
      <div className={s.container}>
        <div className={`${s.sectionHead} ${p.heading}`}>
          <h2 id="umkm-pricing-title">Pilih yang Anda butuhkan.<br />Biayanya jelas dari awal.</h2>
          <p>Mulai dari satu halaman sampai satu alur kerja. Belum yakin pilih yang mana? Ceritakan usaha dan anggaran Anda, kami bantu menentukan cakupannya.</p>
        </div>
        <div className={p.offers}>
          {umkmOffers.map((offer) => (
            <article className={`${p.offer} ${offer.id === "tumbuh" ? p.featured : ""}`} key={offer.id} aria-labelledby={`offer-${offer.id}`}>
              <header className={p.offerHeader}>
                <div className={p.offerLabel}>
                  {offer.id === "tumbuh" && <span className={p.recommendation}>Untuk katalog lebih lengkap</span>}
                </div>
                <h3 id={`offer-${offer.id}`}>{offer.name}</h3>
              </header>
              <p className={p.description}>{offer.description}</p>
              <div className={p.amount}>
                <p className={p.price}>{rupiah(offer.price)}</p>
                <p className={p.priceNote}>Pengerjaan sekali bayar</p>
              </div>
              <ul className={p.features}>{offer.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <a href={umkmInquiry(offer)} className={`${p.consultation} ${offer.id === "tumbuh" ? p.primary : ""}`}>
                Bahas {offer.name}<ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <aside className={p.budget} aria-label="Batas total biaya awal">
          <div>
            <h3>Rincian lengkap,<br />sebelum Anda membayar.</h3>
            <p>Domain dan hosting dihitung terpisah dari harga pengerjaan. Semuanya dirinci dalam penawaran, termasuk layanan tambahan dan pajak jika berlaku.</p>
          </div>
          <div className={p.budgetAmount}>
            <p>Total biaya awal maksimal</p>
            <strong>{rupiah(umkmInitialBudgetCeiling)}</strong>
            <p>Termasuk biaya wajib tahun pertama. Kebutuhan dan cakupan disesuaikan dengan anggaran Anda.</p>
          </div>
        </aside>
        <div className={p.assurances} aria-label="Ketentuan utama pengerjaan">
          <p><strong>50% di awal</strong><span>Pelunasan setelah pratinjau disetujui.</span></p>
          <p><strong>Website milik Anda</strong><span>File diserahkan. Bebas pindah hosting.</span></p>
          <p><strong>14 hari dukungan</strong><span>Perbaikan kesalahan fungsi setelah peluncuran.</span></p>
        </div>
        <div className={p.terms}>
          <details>
            <summary>Domain, hosting & biaya perpanjangan<span aria-hidden="true" className={p.disclosureMark}>+</span></summary>
            <div className={p.termContent}>
              <p>Harga paket adalah biaya pengerjaan sekali bayar. Domain (alamat website), hosting (tempat website berjalan), layanan tambahan berbayar dan pajak jika berlaku dicantumkan terpisah dalam penawaran. Biaya perpanjangan tahunan juga dijelaskan sebelum Anda menyetujui pekerjaan.</p>
              <p>Total biaya awal paket UMKM, termasuk biaya wajib tahun pertama, maksimal {rupiah(umkmInitialBudgetCeiling)}. Jika kebutuhan melebihi anggaran, kami menyesuaikan cakupan atau merekomendasikan alat siap pakai.</p>
            </div>
          </details>
          <details>
            <summary>Pembayaran, materi & serah terima<span aria-hidden="true" className={p.disclosureMark}>+</span></summary>
            <div className={p.termContent}>
              <p>Uang muka 50%; pelunasan setelah pratinjau disetujui, sebelum peluncuran. Untuk Website Mulai, uang muka pengerjaan {rupiah(umkmOffers[0].price / 2)}, di luar layanan tambahan yang perlu dibayar di muka. Materi usaha disediakan oleh Anda.</p>
              <p>File lengkap website atau sistem (kode sumber) dan panduan penggunaan diserahkan kepada Anda. Dukungan perbaikan kesalahan fungsi sesuai kesepakatan tersedia selama 14 hari setelah peluncuran.</p>
            </div>
          </details>
          <details>
            <summary>Batas paket & pemeliharaan opsional<span aria-hidden="true" className={p.disclosureMark}>+</span></summary>
            <div className={p.termContent}>
              <p>Katalog menggunakan WhatsApp untuk pertanyaan pelanggan. Keranjang belanja dan pembayaran online tidak termasuk. Sistem Satu Alur berfokus pada satu alur kerja, bukan sistem untuk seluruh perusahaan, akuntansi, pemindahan data dalam jumlah besar atau integrasi berbayar.</p>
              <p>Pemeliharaan opsional mulai Rp150.000/bulan untuk pemeriksaan dan pembaruan ringan sesuai kesepakatan, di luar biaya layanan tambahan. <Link href="/syarat-ketentuan">Baca ketentuan proyek</Link>.</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
