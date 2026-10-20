import type {ConceptChoice} from './concept-tools';

type Guide = {title:string; description:string; choices:readonly ConceptChoice[]};

export const conceptGuides: Record<string, Guide> = {
  'dapur-saji': {
    title:'Mulai dari cara menikmatinya.',
    description:'Jumlah tamu penting. Cara hidang juga. Pilih kebutuhan yang paling dekat, lalu sesuaikan jumlah dan menunya.',
    choices:[
      {id:'Nasi box',label:'Makan siang atau acara kantor',title:'Satu kotak untuk setiap orang.',description:'Lebih mudah dibagikan saat waktu istirahat terbatas atau tempat duduk tersebar.',details:['Bandingkan isi lauk, sayur dan sambal di setiap menu.','Minimum 10 kotak per pilihan nasi.','Catat alergi dan waktu makan sebelum merangkum.'],action:'Lihat pilihan nasi box'},
      {id:'Snack box',label:'Camilan untuk rapat',title:'Teman jeda di tengah agenda.',description:'Pilihan kudapan untuk pertemuan tanpa hidangan utama. Jumlahnya bisa mengikuti peserta.',details:['Snack Box Sore mulai 15 kotak.','Isi paket perlu dibahas bila ada pantangan.','Pengantaran belum termasuk subtotal makanan.'],action:'Lihat snack box'},
      {id:'Paket berbagi',label:'Kumpul keluarga di rumah',title:'Sajian di tengah, cerita mengalir.',description:'Hidangan berbagi untuk dinikmati bersama. Sesuaikan jumlah paket dengan tamu dan hidangan lainnya.',details:['Paket Meja Keluarga untuk 4–5 orang per paket.','Minimum 2 paket.','Tambahkan kebutuhan alat saji pada catatan.'],action:'Lihat paket berbagi'},
    ],
  },
  'bersih-laundry': {
    title:'Apa yang ada di keranjang?',
    description:'Petunjuk perawatan membantu memilih layanan. Mulai dari jenis barang, lalu lihat perkiraan biaya dan waktunya.',
    choices:[
      {id:'cuci-setrika',label:'Pakaian untuk dipakai lagi',title:'Kembali rapi ke lemari.',description:'Pilih cuci dan setrika untuk pakaian harian yang ingin diterima dalam keadaan rapi.',details:['Minimum 3 kg, berat akhir diperiksa saat diterima.','Reguler 2–3 hari atau pilihan express.','Bahan khusus dan noda perlu diperiksa terpisah.'],action:'Hitung cuci & setrika'},
      {id:'bed-cover',label:'Bed cover dan perlengkapan tidur',title:'Hitungan per barang, perawatan terpisah.',description:'Barang besar membutuhkan cara penanganan yang berbeda dari pakaian harian.',details:['Mulai 1 buah, estimasi reguler 3–4 hari.','Pilihan express tidak tersedia.','Sebutkan ukuran dan petunjuk perawatan pada catatan.'],action:'Hitung perawatan bed cover'},
      {id:'sepatu',label:'Sepatu yang perlu dibersihkan',title:'Lihat bahannya sebelum mulai.',description:'Perawatan bagian luar dan sol disesuaikan dengan kondisi sepatu, bukan disamakan dengan cucian kiloan.',details:['Hitungan per pasang, estimasi 3–4 hari.','Kondisi lem, warna dan bahan perlu diperiksa.','Tidak semua noda atau perubahan warna dapat dipulihkan.'],action:'Hitung perawatan sepatu'},
    ],
  },
  'ruang-kayu': {
    title:'Ruang mana yang ingin kamu isi?',
    description:'Pilih fungsi lebih dulu. Setelah itu, ukur ruang gerak, tentukan panjang meja dan temukan karakter kayunya.',
    choices:[
      {id:'aruna',label:'Meja makan untuk berkumpul',title:'Aruna, tempat semua kembali.',description:'Bidang meja untuk hidangan dan percakapan yang tidak perlu cepat selesai.',details:['Ukuran awal 160 × 85 × 75 cm.','Panjang dapat dirancang 120–240 cm.','Ukur ruang untuk menarik kursi sebelum memilih.'],action:'Rancang Meja Aruna'},
      {id:'teduh',label:'Sudut kerja yang lebih lega',title:'Teduh, ruang untuk fokus.',description:'Meja dengan kedalaman yang pas untuk menata perlengkapan kerja sehari-hari.',details:['Ukuran awal 120 × 65 × 75 cm.','Panjang dapat dirancang 100–180 cm.','Pertimbangkan kursi, stopkontak dan arah cahaya.'],action:'Rancang Meja Teduh'},
      {id:'sela',label:'Jeda kecil di ruang santai',title:'Sela, dekat dengan keseharian.',description:'Meja rendah untuk buku, kopi dan benda-benda yang ingin tetap dekat.',details:['Ukuran awal 90 × 55 × 40 cm.','Panjang dapat dirancang 60–120 cm.','Sisakan jalur berjalan antara meja dan sofa.'],action:'Rancang Meja Sela'},
    ],
  },
  'titik-potong': {
    title:'Potongan yang mengikuti kebiasaan.',
    description:'Seberapa banyak waktu yang Anda punya untuk merapikan rambut setiap pagi? Mulai dari sana.',
    choices:[
      {id:'signature-cut',label:'Rapi untuk sehari-hari',title:'Signature Cut, mulai dari dasarnya.',description:'Ceritakan gaya yang disukai, arah tumbuh rambut dan waktu styling. Konsultasi menjadi bagian dari layanan.',details:['Potong, cuci dan styling akhir.','Durasi rencana 45 menit.','Referensi foto boleh disiapkan sebelum kunjungan.'],action:'Atur Signature Cut'},
      {id:'skin-fade',label:'Gradasi yang lebih tegas',title:'Skin Fade, perhatian pada transisi.',description:'Untuk yang menginginkan sisi lebih bersih dengan gradasi yang ditentukan bersama barber.',details:['Durasi rencana 60 menit.','Bicarakan tinggi gradasi dan panjang bagian atas.','Pilihan jam perlu dikonfirmasi ke barbershop.'],action:'Atur Skin Fade'},
      {id:'cut-beard',label:'Rambut dan janggut sekaligus',title:'Satu kunjungan, lebih menyeluruh.',description:'Pilih bentuk rambut dan janggut yang terasa seimbang dengan karakter Anda.',details:['Layanan rambut dan pembentukan janggut.','Durasi rencana 75 menit.','Sampaikan area kulit sensitif sebelum pengerjaan.'],action:'Atur Cut + Beard'},
    ],
  },
  'putaran-motor': {
    title:'Mulai dari yang Anda rasakan.',
    description:'Keluhan yang jelas membuat pemeriksaan lebih terarah. Pilihan ini membantu menyiapkan rencana, bukan menetapkan diagnosis.',
    choices:[
      {id:'servis-rutin',label:'Sudah waktunya perawatan',title:'Periksa sebelum mulai bermasalah.',description:'Untuk motor harian yang membutuhkan pemeriksaan dasar dan penyetelan berkala.',details:['Ceritakan kapan terakhir melakukan servis.','Harga awal hanya jasa; oli dan komponen terpisah.','Pekerjaan tambahan dibahas setelah pemeriksaan.'],action:'Rencanakan servis rutin'},
      {id:'cvt',label:'Perawatan transmisi matic',title:'Beri perhatian pada area CVT.',description:'Pemeriksaan dan pembersihan transmisi untuk motor matic, sesuai kondisi komponen.',details:['Isi merek dan model motor.','Sebutkan bunyi atau gejala saat akselerasi.','Penggantian komponen perlu persetujuan terpisah.'],action:'Rencanakan perawatan CVT'},
      {id:'diagnostik',label:'Ada bunyi atau tarikan berbeda',title:'Cari penyebabnya lebih dulu.',description:'Jelaskan kapan gejala muncul: saat dingin, saat melaju atau setelah perjalanan jauh.',details:['Pilih Cek Keluhan untuk penelusuran awal.','Ringkasan membantu menjelaskan kondisi ke mekanik.','Diagnosis dan biaya akhir memerlukan pemeriksaan motor.'],action:'Susun catatan keluhan'},
    ],
  },
  kelopak: {
    title:'Untuk momen seperti apa?',
    description:'Pilih rasa yang ingin disampaikan. Nuansa bunga menjadi titik awal; kata-kata pada kartunya tetap dari Anda.',
    choices:[
      {id:'Hangat',label:'Terima kasih yang personal',title:'Senja, hangat tanpa banyak kata.',description:'Peach dan blush untuk sapaan yang terasa dekat, dari teman kerja sampai seseorang di rumah.',details:['Pilih ukuran Regular atau Besar.','Tambahkan pesan kartu di tas bunga.','Komposisi akhir mengikuti musim dan kesepakatan.'],action:'Lihat rangkaian hangat'},
      {id:'Lembut',label:'Sapaan yang lebih tenang',title:'Embun, ruang untuk rasa yang lembut.',description:'Ivory dan hijau sebagai pilihan yang tenang ketika Anda ingin menyampaikan perhatian.',details:['Mulai dari palet putih dan dedaunan.','Ukuran Besar dihitung 1,5 kali Regular.','Kebutuhan khusus sebaiknya ditulis dalam pesan.'],action:'Lihat rangkaian lembut'},
      {id:'Berani',label:'Momen yang ingin dirayakan',title:'Rona, biarkan warnanya berbicara.',description:'Merah dan plum untuk ucapan yang ingin tampil lebih berani.',details:['Atur ukuran sebelum menambahkan ke tas.','Tanggal dan alamat dikonfirmasi sebelum pengiriman.','Subtotal belum mencakup ongkir.'],action:'Lihat rangkaian berani'},
    ],
  },
  'langkah-belajar': {
    title:'Ingin bisa mengerjakan apa?',
    description:'Lebih mudah memilih kelas ketika tujuannya dekat dengan keseharian. Pilih satu kebutuhan dan mulai dari level Anda.',
    choices:[
      {id:'desain-praktis',label:'Membuat visual promosi sendiri',title:'Dari ide menjadi susunan visual.',description:'Latih hierarki, komposisi dan pilihan tipografi dengan pekerjaan yang bisa Anda lanjutkan.',details:['4 pertemuan, masing-masing 90 menit.','Pilih level Pemula jika baru memulai.','Bawa tujuan atau contoh materi yang ingin dikerjakan.'],action:'Rencanakan Desain Praktis'},
      {id:'excel-harian',label:'Merapikan data pekerjaan',title:'Laporan yang lebih mudah dibaca.',description:'Mulai dari data yang tertata, lanjutkan ke rumus dan laporan sederhana untuk rutinitas kerja.',details:['4 pertemuan, masing-masing 90 menit.','Tetapkan tujuan: rumus, rekap atau pelaporan.','Gunakan data latihan tanpa informasi pribadi.'],action:'Rencanakan kelas Excel'},
      {id:'english-talk',label:'Lebih terbiasa berbicara Inggris',title:'Beri ruang untuk berlatih bicara.',description:'Percakapan untuk situasi harian dan pekerjaan, dengan ritme yang dapat Anda ikuti.',details:['6 pertemuan, masing-masing 60 menit.','Pilih level dan sesi yang sesuai.','Hasil bergantung latihan dan kehadiran, tanpa jaminan tertentu.'],action:'Rencanakan kelas percakapan'},
    ],
  },
  'sela-wear': {
    title:'Temukan potongan untuk harimu.',
    description:'Mulai dari yang paling sering kamu pakai. Lihat ukuran dan warna, lalu susun kombinasi yang terasa nyaman.',
    choices:[
      {id:'Atasan',label:'Atasan yang mudah dipadukan',title:'Satu potong, beberapa kemungkinan.',description:'Everyday Tee dan Easy Shirt memberi dua cara mengenakan siluet santai.',details:['Ukuran atasan S–XL; lihat lebar dada pada tanya jawab.','Pilihan warna Ink, Lilac dan Chalk.','Bandingkan ukuran dengan pakaian yang sudah nyaman.'],action:'Lihat pilihan atasan'},
      {id:'Bawahan',label:'Ruang bergerak sepanjang hari',title:'Weekend Pants, tanpa banyak ribet.',description:'Potongan lurus untuk melengkapi kaos atau kemeja santai.',details:['Cek rentang pinggang sebelum menentukan ukuran.','Warna layar dapat berbeda dengan material.','Stok dan detail produk perlu dikonfirmasi.'],action:'Lihat pilihan bawahan'},
      {id:'Aksesori',label:'Barang harian, dalam satu tempat',title:'Daily Tote untuk dibawa bersama.',description:'Pelengkap ringkas untuk benda-benda yang ikut dari satu agenda ke agenda berikutnya.',details:['Satu pilihan ukuran: One size.','Warna dipilih sebelum masuk tas belanja.','Ongkir belum termasuk subtotal.'],action:'Lihat aksesori'},
    ],
  },
};
