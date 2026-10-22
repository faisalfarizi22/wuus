# Arah musik dan efek suara WUUS

Untuk website WUUS: studio digital yang hangat, profesional, ramah UMKM, dengan globe keramik, orbit amber, dan tampilan krem/navy. Karakternya optimistis dan sedikit playful, tetap tenang saat orang membaca harga atau berdiskusi.

Dokumen ini berisi prompt produksi, bukan klaim bahwa audio sudah dibuat atau dipasang. Saat ini website memakai nada sintetis lokal. Musik dan efek suara tetap mati sampai pengunjung mengaktifkannya. Variasi efek di bawah adalah bahan untuk integrasi berikutnya; tidak semuanya sudah memiliki pemicu terpisah.

## Musik latar — Suno

Pilih instrumental. Gunakan prompt utama ini sebagai arah musik/style, tanpa lirik.

> Warm minimal ambient electronica for an independent digital design studio website. Welcoming, quietly optimistic, polished and human, with a subtle sense of curiosity and forward motion. 86 BPM, relaxed half-time feel. Soft felt electric piano, rounded analog synth plucks, airy warm pads, delicate muted percussion and a restrained smooth bass. A short, memorable three-note motif appears sparingly, leaving plenty of space. Cream ceramic, deep navy and amber light translated into sound. Even dynamics, gentle groove, intimate clean mix, suitable for quiet background listening while reading and browsing. Begin with the established texture, keep a consistent mood, and end on the same harmonic atmosphere so a loop can be edited naturally. Instrumental only. No vocals, spoken words, choir, cinematic build, dramatic drops, loud drums, sharp hi-hats, aggressive bass or exaggerated sparkle. Do not include sound effects or interface clicks in the music.

Target: sekitar 90–120 detik, dengan bagian tengah yang konsisten untuk disunting menjadi loop. Prompt tidak menjamin loop mulus; sambungan perlu diperiksa dan disunting dari hasil nyata.

Alternatif jika hasil utama terlalu ramai:

> Quiet warm ambient instrumental for a premium yet approachable creative studio website. Soft felt piano, mellow electric keys, slow rounded synth arpeggios and a light analog pad. Gentle 80 BPM pulse, almost no percussion, no prominent lead melody. Calm, curious, reassuring and subtly playful. Spacious arrangement with soft transients and steady low energy, designed to stay behind reading and conversation. Consistent harmonic texture with no big intro or finale. No voice, lyrics, choir, drums that dominate, risers, drops, loud accents, hiss or environmental noise. Keep interface sound effects out of the music.

Nama file pilihan: `wuus-studio-ambient`.

## Efek suara — ElevenLabs

Generate satu efek per prompt, bukan satu paket dalam satu rekaman. Durasi di bawah adalah target hasil akhir; ruang diam dan ekornya dapat dirapikan setelah file diterima. Semuanya berasal dari satu keluarga suara: sentuhan keramik yang lembut, bunyi bulat, hangat, sedikit digital, tanpa kesan game arcade.

### 1. Klik utama · `wuus-ui-click` · 0,08–0,15 detik

> A single soft, rounded ceramic fingertip tap for a premium website button. Warm, dry, close and precise, with a very subtle digital body underneath. Tiny clean transient, short natural decay. Quiet and tactile, not mechanical. One isolated event only. No music, voice, ambience, reverb, metallic ping, sharp treble or extra clicks.

Ini prioritas pertama: pengganti nada klik sintetis yang sekarang dipakai.

### 2. Menu dibuka · `wuus-menu-open` · 0,18–0,30 detik

> One gentle compact upward air glide ending in a soft ceramic tick, for opening a website navigation panel. Warm, light, smooth and restrained, with a tiny rising tonal movement. Clean isolated sound, quick onset and short tail. No dramatic whoosh, wind noise, harsh high frequencies, music, speech or long reverb.

### 3. Pergeseran galeri · `wuus-gallery-glide` · 0,25–0,45 detik

> A single short silky horizontal glide for a website design gallery smoothly sliding into place. Soft brushed air with a faint rounded wooden-ceramic finish. Fluid, elegant, lightly energetic, never a racing engine. Gentle attack and a clean tapered ending. No impact boom, sharp sweep, music, voices or environmental noise.

Untuk perpindahan kategori yang disengaja, bukan diputar berulang pada setiap gerakan scroll.

### 4. Respons maskot · `wuus-mascot-hello` · 0,35–0,60 detik

> One friendly two-note electronic greeting from a small ceramic globe companion. Rounded warm sine-like notes with a soft mallet texture, a gentle upward interval, curious and welcoming. Subtle character without a cartoon voice. Short, clean and intimate. No speech, laughter, animal sounds, arcade bleeps, sharp chirps, background music or long reverb.

### 5. Chat dibuka · `wuus-chat-open` · 0,20–0,35 detik

> One soft welcoming pop followed by a tiny warm tonal lift for opening a website conversation panel. Rounded, airy and understated, like a small polished ceramic bubble. Quick and clean with a short tail. Not a recognizable messaging app notification. No loud alert, voice, melody, music or ambient noise.

### 6. Pesan terkirim · `wuus-message-sent` · 0,15–0,25 detik

> One compact soft upward digital pulse for a message successfully sent. Warm rounded tone with a muted tactile tick at the beginning. Reassuring, discreet, close and dry. A single isolated event, no repeated notes, no recognizable app notification, music, voice or long reverb.

### 7. Konfirmasi berhasil · `wuus-success` · 0,35–0,55 detik

> One restrained two-note confirmation sound, gently ascending with a warm ceramic mallet timbre and a smooth soft electronic body. Calm confidence, professional and friendly rather than celebratory. Clean isolated audio, light attack and short decay. No fanfare, coins, game achievement, music, speech or bright metallic ringing.

### 8. Perlu diperiksa · `wuus-attention` · 0,25–0,40 detik

> One gentle low rounded double tap for a website field that needs attention. Soft ceramic texture, a small descending tonal movement, calm and helpful rather than alarming. Quiet, dry and short. No warning siren, buzzer, harsh distortion, dramatic impact, music, voice or sustained ringing.

## Paket hasil yang bisa dikirim

- Satu musik pilihan dan setiap efek sebagai file terpisah, memakai nama di atas.
- Kirim format unduhan yang tersedia; WAV cocok sebagai master jika tersedia.
- Efek tanpa musik latar. Musik tanpa efek klik, sapaan, atau notifikasi.
- Pilih hasil yang tetap nyaman setelah klik berulang. Musik harus terasa di belakang konten, dan efek tidak boleh mengejutkan atau lebih keras daripada musik.
- Setelah file diterima, periksa hasil dengan mendengarkan, rapikan durasi/loop, samakan tingkat volume, lalu kompres untuk web. Jangan menilai keberhasilan hanya dari prompt atau nama file.
- Hover, scroll biasa, dan setiap huruf yang diketik tetap senyap. Pengunjung memiliki kontrol musik dan efek secara terpisah.

## Implementasi audio · 22 Oktober 2026

File Owner dari `public/sound/Warm Fiano.mp3` dan `SFX-1.wav` sampai `SFX-8.wav` dipertahankan sebagai master lokal. Website memakai salinan MP3 bernama `wuus-*`, dengan tingkat volume diseragamkan dan ruang diam efek dirapikan. Musik sekitar dua menit, loop native, volume awal18%; efek22–28%. Pemutaran hanya setelah pengunjung memilih tombol musik/efek; file tidak dipreload oleh komponen. Tab disembunyikan atau halaman ditinggalkan menghentikan audio.

Pemetaan nomor mengikuti urutan brief:1klik,2menu,3galeri,4maskot,5chat dibuka,6pesan diterima backend,7sukses,8perhatian. Efek7tersedia dalam katalog, tetapi belum dipasang ke konfirmasi bisnis tambahan yang belum ada. Pesan terkirim berbunyi hanya setelah server mengonfirmasi penyimpanan; tidak ada bunyi yang mengklaim balasan AI sudah tersedia. Interaksi hover, mengetik dan scroll biasa tetap senyap. Efek baru menghentikan efek sebelumnya agar tidak menumpuk.

Pemeriksaan teknis mencakup decoding file, pemutaran browser melalui tombol dan penanganan klik cepat. Penyambungan loop memakai pengulangan track, bukan klaim loop musikal tanpa sambungan. Penilaian selera dan kenyamanan suara tetap perlu didengarkan Owner pada perangkatnya.
