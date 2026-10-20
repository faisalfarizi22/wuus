# Penyempurnaan delapan contoh desain — 19 Oktober 2026

Pekerjaan ini mempertahankan delapan identitas yang sudah ada. Tujuannya membantu pengunjung memahami pilihan, mencoba alur utama dan menyimpan hasilnya; bukan menambahkan klaim pekerjaan klien. Semua tetap berlabel **Contoh desain**, tanpa pemesanan, pembayaran, atau pengiriman data sungguhan.

## Perubahan per usaha

| Contoh desain | Keputusan yang dibantu | Sambungan ke alur utama |
| --- | --- | --- |
| Dapur Saji | Cara hidang untuk acara kantor, rapat atau keluarga; minimum porsi dan biaya pengantaran | Pilihan kebutuhan membuka kategori menu yang sesuai, lalu jumlah masuk ke rencana pesanan |
| Bersih Laundry | Pakaian, bed cover atau sepatu; batas layanan express dan pemeriksaan bahan | Layanan yang dipilih mengubah perhitungan, satuan dan minimum pada perencana |
| Ruang Kayu | Ruang makan, kerja atau santai; ukuran awal dan rentang panjang tiap koleksi | Koleksi terpilih masuk ke konfigurator; diagram jejak meja mengikuti panjang, lebar dan material yang benar-benar dipilih |
| Titik Potong | Potongan harian, skin fade atau rambut sekaligus janggut | Pilihan langsung mengisi layanan rencana kunjungan; durasi dan kebutuhan konsultasi dijelaskan sebelum memilih |
| Putaran Motor | Perawatan rutin, CVT atau penelusuran keluhan | Pilihan mengisi rencana servis, dengan pemisahan jasa awal, suku cadang dan diagnosis setelah pemeriksaan |
| kelopak | Ucapan hangat, lembut atau berani; ukuran buket dan pesan kartu | Pilihan kebutuhan menyaring rangkaian yang relevan; ukuran dan subtotal tetap dihitung di tas bunga |
| Langkah Belajar | Visual promosi, pengolahan data atau percakapan Inggris | Pilihan mengisi kelas perencana, dengan level, durasi dan tujuan latihan yang jelas |
| SELA Wear | Atasan, bawahan atau aksesori; cara memeriksa ukuran dan warna | Pilihan menyaring koleksi; ukuran dan warna tetap dipilih per produk sebelum masuk tas |

## Alur dan tampilan

Hero, katalog, cerita, proses, rencana, FAQ dan penutup yang sudah ada dipertahankan. Panduan kebutuhan berupa satu area keputusan terbuka dengan pilihan radio dan rincian kontekstual, bukan grid kartu baru. Warna mengikuti masing-masing konsep. Konten tetap dapat dibaca tanpa animasi.

Navigasi menandai bagian yang sedang dibaca melalui satu `IntersectionObserver` per halaman, tanpa loop scroll atau pustaka tambahan. Menu navigasi mobile Ruang Kayu kini dapat dibuka dan ditutup. Layanan terpilih pada katalog menampilkan status visual yang konsisten dengan perencana. Foto hero lima contoh memiliki satu gerakan masuk kecil; interaksi berulang tetap singkat. Preferensi reduced motion menonaktifkan gerakan tersebut.

Semua delapan contoh menyediakan salin dan unduh ringkasan `.txt` di perangkat pengunjung. Kegagalan clipboard memiliki petunjuk salin manual. File lokal tidak dianggap sebagai pesanan masuk, slot terpesan atau transaksi berhasil.

Diagram Ruang Kayu adalah gambar ukur geometris dari konfigurasi. Diagram menunjukkan panjang dan lebar meja, tidak mengarang denah ruangan atau mengklaim kecocokan ruang kursi. Ukuran tidak valid tidak menghasilkan diagram atau ringkasan baru.

## Siap disesuaikan untuk brand pelanggan

Data produk/layanan dan perhitungan yang sudah ada tetap menjadi sumber harga, batas jumlah, ukuran dan durasi. Panduan kebutuhan harus tetap cocok dengan ID/kategori yang tersedia; pengujian memeriksa hubungan ini pada seluruh delapan konsep. Ketika dipakai untuk usaha nyata, ganti identitas, foto, harga, area layanan dan kebijakan dengan data pelanggan yang disetujui. Pengiriman, reservasi, pembayaran dan stok membutuhkan integrasi tersendiri; alur lokal ini tidak mengaktifkannya.

## Pemeriksaan yang benar-benar dijalankan

- TypeScript `tsc --noEmit --incremental false`: lulus.
- ESLint pada enam berkas konsep yang diubah/ditambahkan: lulus.
- 14 pengujian domain dan panduan: lulus, meliputi minimum, kelipatan jumlah, batas ukuran, varian keranjang, tanggal dan kecocokan panduan dengan katalog.
- Seluruh CSS konsep dapat diparse melalui PostCSS.
- Impeccable detector pada sepuluh target TSX/CSS: `[]`.

Belum dilakukan inspeksi browser desktop/mobile karena penggunaan browser lokal dinonaktifkan pada Work settings dalam sesi ini. Tidak ada klaim visual QA atau angka FPS baru. Build/restart/deployment tidak dijalankan oleh penugasan ini; koordinator memeriksa setelah pekerjaan aktif selesai.

## Batas yang dipertahankan

Outreach dan jadwal otomatis tidak diaktifkan. Tidak ada secret dibaca, provider diubah, SQL produksi dijalankan atau pesan pelanggan dikirim. Perubahan ini berada di worktree rilis `outputs/umkm-release`; publikasi belum diklaim.
