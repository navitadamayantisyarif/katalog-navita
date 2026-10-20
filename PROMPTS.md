# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Ubah halaman katalog agar mengambil produk dari tabel `produk` di Supabase pada sisi server, menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`. Pertahankan tampilan kartu, tampilkan pesan error atau kondisi tabel kosong, dan hapus `CatatanBelumAktif`.

**Hasil:**
Katalog membaca produk dengan klien Supabase server-only dan menampilkan kartu yang sudah tersedia. Halaman dirender dinamis agar data terbaru dibaca dari database.

**Perbaikan:**
Build awal menunjukkan halaman katalog diprerender statis; mode render dinamis ditambahkan dan build ulang mengonfirmasi route `/` dirender di server.

## US-02 Detail produk

**Prompt:**
Ambil satu produk dari Supabase berdasarkan ID URL di halaman detail. Panggil `notFound()` jika produk tidak ada, pertahankan tampilan dan tombol WhatsApp, lalu hapus `CatatanBelumAktif`.

**Hasil:**
Halaman detail memakai klien Supabase server yang sama, mengambil kolom produk yang diperlukan, dan memanggil `notFound()` untuk hasil kosong.

**Perbaikan:**
Error query database dibedakan dari produk yang tidak ditemukan; error query diteruskan sebagai error, bukan dianggap sebagai 404.

## US-03 Pesan via WhatsApp

**Prompt:**
Buat tombol WhatsApp sebagai tautan `wa.me` ke nomor di `lib/toko.js`, dengan pesan nama dan harga produk dalam format rupiah yang di-encode serta dibuka di tab baru. Pertahankan tampilan dan hapus catatan US-03 di halaman detail.

**Hasil:**
Tombol menjadi tautan WhatsApp dengan pesan otomatis, `encodeURIComponent`, dan atribut pembukaan tab baru yang aman.

**Perbaikan:**
Nomor telepon dinormalisasi menjadi format internasional untuk URL `wa.me`; catatan tombol yang belum berfungsi di halaman detail dihapus.

## US-04 Login admin

**Prompt:**
Buat login admin dengan Supabase Auth, `@supabase/ssr`, cookie, `SUPABASE_URL`, dan `SUPABASE_PUBLISHABLE_KEY`. Proses dengan Server Action, arahkan login sukses ke `/admin`, tampilkan error login, dan fungsikan tombol keluar.

**Hasil:**
Klien sesi server menggunakan cookie dibuat. Server Action menangani login/logout; form login menampilkan pesan gagal dan tombol keluar mengakhiri sesi.

**Perbaikan:**
Tidak ada perubahan tampilan form atau navigasi. `CatatanBelumAktif` di halaman login dihapus dan build berhasil.

## US-05 Ganti password

**Prompt:**
Buat Server Action untuk admin yang sedang login agar dapat mengganti password. Validasi minimal 8 karakter dan konfirmasi di server, tampilkan pesan berhasil/error, sambungkan ke form tanpa mengubah tampilannya, dan hapus `CatatanBelumAktif`.

**Hasil:**
Password divalidasi di Server Action, sesi diverifikasi dengan `auth.getUser()`, kemudian Supabase Auth memperbarui password. Halaman menampilkan status yang jelas.

**Perbaikan:**
Validasi autentikasi dilakukan di server sebelum perubahan password; build berhasil.

## US-06 Proteksi halaman admin

**Prompt:**
Buat `proxy.js` Next.js 16 untuk melindungi semua rute `/admin` selain `/admin/login` menggunakan Supabase Auth. Pastikan aksi mutasi memverifikasi login di server dan hapus `CatatanBelumAktif` dari dashboard.

**Hasil:**
Proxy memverifikasi sesi Supabase dan mengalihkan pengunjung tanpa sesi ke halaman login. Aksi ganti password juga memverifikasi sesi secara mandiri.

**Perbaikan:**
Pemeriksaan menemukan belum ada Server Action produk yang mengubah data saat US-06 dikerjakan. Build mendeteksi Proxy Next.js.

## Debugging dan fitur bonus

### Git push ditolak dan rebase

**Prompt:**
Minta bantuan memahami penolakan `git push`, konflik README saat rebase, editor pesan commit, dan status `ahead 2`.

**Hasil:**
Penolakan dijelaskan sebagai commit remote yang belum ada di lokal. Panduan diberikan untuk menyelesaikan konflik, melanjutkan rebase, lalu melakukan push setelah rebase selesai.

**Perbaikan:**
Tidak ada perintah Git yang dijalankan oleh AI. Pengguna menyelesaikan rebase secara manual.

### US-07 sampai US-10 Pengelolaan produk

**Prompt:**
Tambahkan daftar produk database, tambah produk, ubah produk, dan hapus produk dengan konfirmasi; semua mutasi harus memeriksa sesi admin.

**Hasil:**
Dashboard dan form tambah/edit mengambil atau menyimpan data lewat klien sesi admin Supabase. Aksi server memvalidasi sesi dan input; penghapusan meminta konfirmasi.

**Perbaikan:**
Daftar produk dan form edit memakai RLS melalui sesi admin, bukan secret key. Validasi harga dibatasi sesuai tipe integer skema. Build berhasil.

### US-11 Filter dan pencarian

**Prompt:**
Tambahkan filter kategori dan pencarian nama pada katalog.

**Hasil:**
Katalog memiliki input pencarian nama dan pilihan kategori; hasil kosong menampilkan pesan yang jelas.

**Perbaikan:**
Filter hanya memproses data yang telah diambil server; tidak ada klien Supabase di browser.

### US-12 Pilih jumlah

**Prompt:**
Tambahkan pilihan jumlah sebelum pemesanan dan sertakan pilihan di pesan WhatsApp.

**Hasil:**
Halaman detail menyediakan input jumlah; pesan WhatsApp memuat jumlah dan total harga.

**Perbaikan:**
Karena skema produk tidak memiliki data varian, fitur menggunakan jumlah. Tautan pemesanan dicegah untuk jumlah atau total yang tidak valid.

### US-13 PWA

**Prompt:**
Tambahkan dukungan PWA dengan manifest dan ikon yang sudah tersedia.

**Hasil:**
`app/manifest.js` menghasilkan manifest yang merujuk ikon 192x192 dan 512x512. Build mengonfirmasi route `/manifest.webmanifest`.

**Perbaikan:**
Dijelaskan bahwa instalasi biasanya disediakan oleh browser, bukan tombol dalam halaman, dan deployment harus menggunakan HTTPS untuk mendukung instalasi.

### US-14 Deskripsi produk dengan Gemini AI

**Prompt:**
Tambahkan pembuatan draf deskripsi produk dengan Gemini dari nama dan kategori; panggilan API harus di server, hasil mengisi form, dan kunci tidak boleh tampil di browser.

**Hasil:**
Form tambah/edit memiliki tombol pembuat deskripsi. Server Action memverifikasi admin dan menghubungi Gemini menggunakan `GEMINI_API_KEY`; `.env.example` dan dokumentasi setup diperbarui.

**Perbaikan:**
Jika key belum tersedia atau API gagal, form menampilkan pesan yang dapat dipahami. Keberhasilan build sudah diverifikasi; pembuatan deskripsi langsung bergantung pada key valid dan belum diuji end-to-end. Keberadaan nilai key lokal dikonfirmasi tanpa menampilkan nilainya.
