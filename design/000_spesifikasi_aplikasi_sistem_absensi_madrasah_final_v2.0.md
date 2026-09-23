# SPESIFIKASI APLIKASI

## Sistem Absensi Madrasah Berbasis Geofencing & QR Code

**Versi:** 2.0  
**Status:** Final Application Specification

---

## 1. Pendahuluan

Dokumen ini menjelaskan bagaimana kebutuhan bisnis diterjemahkan menjadi perilaku aplikasi, fitur, aturan, layar, validasi, dan alur utama.

Dokumen ini menjadi acuan untuk desain UI/UX, pengembangan frontend/backend, perancangan database, integrasi Supabase, testing, debugging, dan deployment.

---

## 2. Prinsip Dasar

1. Presensi hanya terdiri dari **datang** dan **pulang**.
2. Tidak ada jadwal pelajaran atau jadwal mata pelajaran.
3. Presensi berbasis geofencing GPS.
4. Presensi siswa dilakukan dengan QR Code yang dipindai guru.
5. Semua guru yang berwenang dapat memindai semua siswa.
6. Guru melakukan presensi dirinya sendiri.
7. Guru tidak dapat mengubah presensi secara langsung.
8. Admin dapat melakukan koreksi presensi.
9. Koreksi presensi dicatat dalam audit trail.
10. Data dipisahkan berdasarkan Tahun Pelajaran/Periode.
11. Satu pengguna dapat memiliki beberapa role.
12. Notifikasi hanya tersedia di dalam aplikasi.
13. Informasi perangkat tidak dicatat.
14. Jadwal efektif mengikuti prioritas: **tanggal khusus → libur/jadwal khusus → override guru → jadwal standar**.

---

## 3. Aktor dan Role

### 3.1 Admin

Admin dapat mengelola akun, role, data Madrasah, guru, siswa, kelas/rombel, Wali Kelas, periode, jadwal, kalender khusus, geofence, koreksi presensi, approval sebagai pengganti approver, audit trail, dashboard, laporan, dan export.

### 3.2 Guru

Guru dapat melakukan presensi datang/pulang, memindai QR siswa, melakukan verifikasi manual siswa, mengajukan koreksi, dan mengajukan izin/sakit. Guru tidak dapat mengubah presensi secara langsung.

### 3.3 Wali Kelas

Wali Kelas adalah role khusus yang dapat dimiliki guru. Wali Kelas dapat melihat presensi kelasnya dan memproses approval izin siswa sesuai kewenangan.

### 3.4 Kepala Madrasah

Kepala Madrasah dapat melihat dashboard, laporan, dan audit trail sesuai kewenangan.

### 3.5 Siswa

Siswa memiliki identitas, NISN, kelas/rombel, dan QR Code statis. Siswa tidak melakukan scan QR sendiri.

---

## 4. Authentication dan Authorization

- Pengguna harus login untuk mengakses fitur yang memerlukan autentikasi.
- Akun tidak aktif tidak dapat digunakan.
- Logout tersedia.
- Setiap fitur memeriksa role dan hak akses.
- Pengguna hanya dapat mengakses data sesuai kewenangannya.

---

## 5. Manajemen User dan Role

Admin dapat:

- melihat user;
- membuat user;
- mengedit user;
- mengaktifkan/menonaktifkan user;
- menetapkan role;
- mengubah role.

Satu user dapat mempunyai lebih dari satu role.

Contoh: seorang guru dapat memiliki role **Guru** dan **Wali Kelas**.

---

## 6. Master Data

Master data minimal:

1. Madrasah
2. Guru
3. Siswa
4. Kelas/Rombel
5. Wali Kelas
6. User
7. Tahun Pelajaran/Periode
8. Jadwal
9. Kalender/Tanggal Khusus
10. Geofence

Admin dapat mengedit data Madrasah.

Data siswa minimal memiliki identitas, NISN, kelas/rombel, status aktif, dan QR Code statis.

---

## 7. Tahun Pelajaran / Periode

Sistem menggunakan Tahun Pelajaran/Periode untuk mencegah data antarperiode tercampur.

Admin dapat membuat dan mengaktifkan periode. Periode aktif menjadi konteks utama aplikasi.

Data presensi, jadwal, dan data terkait harus dapat dikaitkan dengan periode yang relevan.

---

## 8. Import Excel

Import Excel digunakan minimal untuk data Guru dan Siswa.

Fitur harus menyediakan:

- template Excel;
- upload file;
- validasi data;
- hasil data berhasil;
- data gagal;
- alasan kegagalan.

Proses dibuat sederhana agar mudah digunakan Admin.

---

## 9. Geofencing

### 9.1 Radius

Radius geofence default adalah **200 meter**.

### 9.2 Akurasi GPS

Minimum akurasi GPS yang diterima adalah **30 meter**.

Jika akurasi tidak memenuhi batas, presensi ditolak dan aplikasi memberikan guidance.

### 9.3 GPS Tidak Tersedia

Jika GPS tidak tersedia:

- presensi ditolak;
- tampilkan notifikasi/guidance;
- arahkan pengguna mengaktifkan lokasi.

### 9.4 Permission Ditolak

Jika permission lokasi ditolak:

- presensi tidak dapat dilakukan;
- tampilkan guidance;
- arahkan pengguna memberikan permission.

### 9.5 Data Lokasi

Presensi menyimpan informasi yang diperlukan, termasuk:

- koordinat GPS;
- jarak dari lokasi Madrasah;
- waktu presensi.

Informasi perangkat tidak dicatat.

---

## 10. Jadwal Kehadiran

Sistem hanya memiliki jadwal:

- datang;
- pulang.

Tidak ada jadwal pelajaran.

### 10.1 Jadwal Standar

Admin mengelola jadwal standar sebagai fallback.

### 10.2 Tanggal Khusus

Tanggal khusus dapat berupa:

- LIBUR;
- jadwal khusus.

### 10.3 Prioritas Jadwal

Urutan penentuan jadwal efektif:

```text
Tanggal khusus
      ↓
Libur / Jadwal khusus
      ↓
Override Guru
      ↓
Jadwal Standar
```

Aturan:

1. Jika tanggal LIBUR, tidak ada presensi normal.
2. Jika tanggal aktif memiliki jadwal khusus, jadwal khusus menjadi jadwal dasar.
3. Override guru diterapkan setelah jadwal dasar ditentukan.
4. Jika tidak ada tanggal khusus, jadwal standar digunakan.
5. Override dapat membuat jam datang atau pulang lebih awal maupun lebih lambat.

---

## 11. Toleransi Jam Datang

Toleransi datang adalah **10 menit**.

Contoh jadwal efektif 07:00:

- sampai 07:10 → **Hadir**;
- setelah 07:10 → **Terlambat**.

---

## 12. Batas Pulang Cepat

Toleransi pulang cepat adalah **10 menit sebelum jadwal efektif**.

Contoh jadwal efektif 15:00:

- 14:50–15:00 → normal;
- sebelum 14:50 → **Pulang Cepat**.

---

## 13. Jam Aktif Absensi

### 13.1 Datang

Absensi datang aktif dari **60 menit sebelum** sampai **120 menit setelah** jadwal efektif.

Contoh jadwal 07:00:

- buka 06:00;
- tutup 09:00.

### 13.2 Pulang

Absensi pulang aktif dari **120 menit sebelum** sampai **180 menit setelah** jadwal efektif.

Contoh jadwal 15:00:

- buka 13:00;
- tutup 18:00.

Di luar jendela tersebut, presensi ditolak.

---

## 14. Presensi Guru

### 14.1 Datang

Alur:

```text
Login
→ Buka Presensi
→ Pilih Datang
→ Ambil GPS
→ Validasi permission
→ Validasi akurasi
→ Validasi geofence
→ Validasi jam aktif
→ Validasi duplicate
→ Simpan
→ Tentukan status
→ Tampilkan hasil
```

### 14.2 Pulang

Presensi pulang dilakukan dengan validasi yang sama sesuai aturan pulang.

Presensi pulang bersifat wajib.

Jika sudah ada presensi datang tetapi tidak ada presensi pulang setelah periode pulang berakhir, status menjadi **Belum Absen Pulang** dan Admin dapat menangani melalui koreksi.

---

## 15. Presensi Siswa

Presensi siswa dilakukan oleh guru menggunakan QR Code.

Semua guru dapat memindai semua siswa tanpa pembatasan kelas.

Untuk setiap scan:

1. Guru login.
2. Membuka scanner.
3. Sistem mengambil GPS guru.
4. Sistem memvalidasi GPS.
5. QR dibaca.
6. NISN dicari.
7. Guru melakukan verifikasi manual bahwa QR sesuai dengan siswa.
8. Sistem memeriksa jenis presensi.
9. Sistem memeriksa jam aktif.
10. Sistem memeriksa duplicate.
11. Presensi disimpan.
12. ID guru scanner dicatat.

Tidak ada verifikasi biometrik.

---

## 16. QR Code Siswa

QR Code:

- bersifat statis;
- berisi NISN;
- tidak membutuhkan reset;
- dapat digunakan untuk kartu siswa.

Jika QR tidak valid atau NISN tidak ditemukan, scan ditolak dan sistem memberikan notifikasi.

---

## 17. Anti-Duplicate

Sistem mencegah presensi ganda untuk kategori yang sama.

Contoh:

- sudah scan datang;
- scan datang berikutnya ditolak.

Aturan yang sama berlaku untuk pulang.

---

## 18. Status Kehadiran

Status utama:

- Hadir
- Terlambat
- Pulang Cepat
- Belum Absen Pulang
- Alpa
- Izin
- Sakit
- Izin Menunggu Approval

### 18.1 Hadir

Arrival sampai dengan toleransi 10 menit.

### 18.2 Terlambat

Arrival setelah toleransi.

Kondisi khusus: **tidak ada arrival tetapi ada departure → Terlambat**.

### 18.3 Pulang Cepat

Departure lebih dari 10 menit sebelum jadwal efektif.

### 18.4 Belum Absen Pulang

Ada arrival, tidak ada departure, dan periode pulang sudah berakhir.

### 18.5 Alpa

Tidak ada arrival dan departure pada hari aktif, periode absensi telah berakhir, dan tidak ada izin/sakit yang disetujui.

### 18.6 Izin/Sakit

Berasal dari izin/sakit yang telah disetujui.

### 18.7 Izin Menunggu Approval

Digunakan untuk pengajuan yang masih pending, termasuk setelah approval yang sebelumnya dibatalkan Admin.

---

## 19. Auto-Alpa

Setelah periode absensi berakhir, sistem mengevaluasi data.

Jika:

- tidak ada datang;
- tidak ada pulang;
- tidak ada izin/sakit yang disetujui;

maka status otomatis menjadi **Alpa**.

Data presensi atau izin yang valid tidak boleh ditimpa oleh proses Auto-Alpa.

---

## 20. Koreksi Presensi

### Guru

Guru dapat mengajukan koreksi, tetapi tidak dapat mengubah presensi secara langsung.

### Admin

Admin dapat mengubah presensi secara langsung, termasuk menangani **Belum Absen Pulang**.

Alasan koreksi tidak wajib.

Setiap koreksi wajib dicatat pada audit trail.

---

## 21. Audit Trail

Audit trail hanya dapat dilihat oleh:

- Admin;
- Kepala Madrasah.

Minimal mencatat:

- timestamp;
- Admin yang melakukan perubahan;
- attendance record yang diubah;
- nilai/status sebelum;
- nilai/status sesudah.

Informasi perangkat tidak dicatat.

---

## 22. Perizinan Siswa

Siswa dapat mengajukan izin/sakit.

Aturan:

- tidak ada deadline;
- dapat diajukan untuk tanggal lampau;
- satu pengajuan dapat mencakup beberapa tanggal;
- dapat berupa rentang tanggal;
- lampiran opsional.

Lampiran:

- maksimal 1 file;
- PDF/JPG/JPEG/PNG;
- maksimal 2 MB.

---

## 23. Approval Izin Siswa

Wali Kelas dapat memproses approval sesuai kewenangan.

Admin dapat menjadi approver pengganti.

Hanya Admin yang dapat membatalkan approval.

Jika Approved dibatalkan:

```text
Approved → Pending
```

Dampak presensi:

```text
Izin Menunggu Approval
```

---

## 24. Perizinan dan Approval Guru

Guru dapat mengajukan izin/sakit dengan aturan yang sama:

- tidak ada deadline;
- tanggal lampau diperbolehkan;
- rentang tanggal diperbolehkan;
- lampiran opsional.

Approval dilakukan oleh pihak yang berwenang dan Admin dapat menjadi approver pengganti.

Pembatalan approval hanya oleh Admin dan mengembalikan status ke Pending.

---

## 25. Dashboard

Dashboard default menggunakan:

- periode aktif;
- hari ini.

Filter:

- tanggal/rentang tanggal;
- individu;
- kelas/rombel;
- seluruh Madrasah.

Indikator:

- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- Izin/Sakit.

Visualisasi:

- summary cards;
- distribusi status;
- tren presensi berdasarkan tanggal.

Scope:

- Siswa/Guru → data personal;
- Wali Kelas → data kelas;
- Admin/Kepala Madrasah → data Madrasah.

---

## 26. Laporan

Laporan tersedia untuk:

- harian;
- mingguan;
- bulanan.

Filter minimal:

- individu;
- kelas/rombel;
- seluruh Madrasah;
- periode;
- rentang tanggal.

---

## 27. Export

Format:

- XLSX;
- PDF.

### 27.1 Kolom Excel

1. Periode
2. Tanggal
3. Identitas
4. Kelas/Rombel
5. Jam Datang
6. Status Datang
7. Jam Pulang
8. Status Pulang
9. Status Akhir
10. Keterangan Izin

### 27.2 PDF

- A4 landscape;
- header Madrasah;
- periode;
- rentang tanggal;
- tabel;
- nomor halaman.

Nama file:

```text
Rekap-Presensi_[Periode]_[TanggalMulai]-[TanggalAkhir].[xlsx/pdf]
```

---

## 28. Notifikasi dan Guidance

Notifikasi hanya **in-app**.

Tidak menggunakan email, WhatsApp, atau push notification eksternal.

Bentuk:

- toast;
- alert;
- banner;
- dialog;
- status;
- guidance.

Minimal untuk:

- GPS tidak tersedia;
- permission ditolak;
- akurasi buruk;
- di luar radius;
- jam belum dibuka;
- jam sudah ditutup;
- duplicate;
- QR tidak valid;
- siswa tidak ditemukan;
- presensi berhasil;
- approval/rejection;
- Belum Absen Pulang;
- guidance saat aplikasi dibuka.

---

## 29. Keamanan

Sistem menerapkan:

- authentication;
- authorization;
- pemisahan role;
- pembatasan akses data;
- perlindungan data presensi;
- perlindungan audit trail;
- validasi input;
- validasi status akun.

Audit trail hanya dapat diakses Admin dan Kepala Madrasah.

---

## 30. Daftar Layar Utama

### Authentication

1. Login

### Dashboard

2. Dashboard sesuai role

### Presensi

3. Presensi Guru
4. Presensi Datang
5. Presensi Pulang
6. Scanner QR Siswa
7. Hasil Scan
8. Detail Presensi

### Master Data

9. Data Siswa
10. Detail Siswa
11. QR Siswa
12. Data Guru
13. Detail Guru
14. Data Kelas/Rombel
15. Detail Kelas
16. Pengaturan Wali Kelas

### User

17. Data User
18. Form User
19. Role User

### Jadwal

20. Jadwal Standar
21. Kalender Tanggal Khusus
22. Override Jadwal Guru

### Geofence

23. Pengaturan Lokasi/Geofence

### Perizinan

24. Pengajuan Izin
25. Daftar Izin
26. Detail Izin
27. Approval Izin

### Koreksi

28. Daftar Koreksi/Presensi
29. Form Koreksi
30. Detail Audit Trail

### Laporan

31. Laporan Presensi
32. Export

### Pengaturan

33. Data Madrasah
34. Tahun Pelajaran/Periode
35. Import Excel

Jumlah layar dapat disesuaikan pada tahap UI/UX selama fungsi bisnis tetap terpenuhi.

---

## 31. Alur Utama Sistem

### 31.1 Presensi Guru

```text
Login
 ↓
Presensi
 ↓
Datang/Pulang
 ↓
GPS
 ↓
Permission
 ↓
Akurasi
 ↓
Geofence
 ↓
Jam Aktif
 ↓
Duplicate
 ↓
Simpan
 ↓
Status
 ↓
Hasil
```

### 31.2 Presensi Siswa

```text
Guru Login
 ↓
Scanner
 ↓
GPS Guru
 ↓
Validasi GPS
 ↓
Scan QR
 ↓
Decode NISN
 ↓
Cari Siswa
 ↓
Verifikasi Manual
 ↓
Datang/Pulang
 ↓
Jam Aktif
 ↓
Duplicate
 ↓
Simpan
 ↓
Catat Scanner ID
 ↓
Status
```

### 31.3 Auto-Alpa

```text
Periode Absensi Berakhir
 ↓
Evaluasi
 ↓
Ada Datang?
 ├─ Ya → Tidak Alpa
 └─ Tidak
      ↓
   Ada Pulang?
   ├─ Ya → Terlambat
   └─ Tidak
        ↓
   Ada Izin/Sakit Disetujui?
   ├─ Ya → Izin/Sakit
   └─ Tidak → Alpa
```

### 31.4 Koreksi

```text
Guru Ajukan Koreksi
 ↓
Admin Memproses
 ↓
Admin Mengubah Data
 ↓
Simpan
 ↓
Audit Trail
 ↓
Data Diperbarui
```

### 31.5 Approval

```text
Pengajuan
 ↓
Pending
 ↓
Approver
 ├─ Approved
 └─ Rejected

Approved dibatalkan Admin
 ↓
Pending
 ↓
Izin Menunggu Approval
```

---

## 32. Aturan Bisnis Final

| ID     | Aturan                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| BR-001 | Presensi hanya datang dan pulang.                                                                                    |
| BR-002 | Tidak ada jadwal pelajaran.                                                                                          |
| BR-003 | Radius geofence default 200 meter.                                                                                   |
| BR-004 | Minimum akurasi GPS 30 meter.                                                                                        |
| BR-005 | GPS diperlukan untuk presensi berbasis lokasi.                                                                       |
| BR-006 | Guru melakukan presensi sendiri.                                                                                     |
| BR-007 | Semua guru dapat scan semua siswa.                                                                                   |
| BR-008 | QR siswa statis.                                                                                                     |
| BR-009 | QR berisi NISN.                                                                                                      |
| BR-010 | Guru memverifikasi QR secara manual.                                                                                 |
| BR-011 | Siswa tidak scan QR sendiri.                                                                                         |
| BR-012 | Presensi siswa menggunakan GPS guru/scanner.                                                                         |
| BR-013 | Duplicate pada kategori sama ditolak.                                                                                |
| BR-014 | Presensi pulang wajib.                                                                                               |
| BR-015 | Arrival ada, departure tidak ada setelah periode berakhir → Belum Absen Pulang.                                      |
| BR-016 | Arrival dan departure tidak ada pada hari aktif setelah periode berakhir → Alpa jika tidak ada izin/sakit disetujui. |
| BR-017 | Alpa ditetapkan otomatis.                                                                                            |
| BR-018 | Guru tidak dapat mengubah presensi langsung.                                                                         |
| BR-019 | Guru dapat mengajukan koreksi.                                                                                       |
| BR-020 | Admin dapat mengubah presensi.                                                                                       |
| BR-021 | Alasan koreksi tidak wajib.                                                                                          |
| BR-022 | Koreksi dicatat dalam audit trail.                                                                                   |
| BR-023 | Audit hanya untuk Admin dan Kepala Madrasah.                                                                         |
| BR-024 | Informasi perangkat tidak dicatat.                                                                                   |
| BR-025 | Override datang dapat lebih awal/lambat dari standar.                                                                |
| BR-026 | Override pulang dapat lebih awal/lambat dari standar.                                                                |
| BR-027 | Tidak ada deadline izin.                                                                                             |
| BR-028 | Izin tanggal lampau diperbolehkan.                                                                                   |
| BR-029 | Izin dapat mencakup rentang tanggal.                                                                                 |
| BR-030 | Pembatalan approval hanya oleh Admin.                                                                                |
| BR-031 | Pembatalan approval mengubah Approved menjadi Pending.                                                               |
| BR-032 | Pembatalan approval berdampak Izin Menunggu Approval.                                                                |
| BR-033 | Admin dapat menjadi approver pengganti.                                                                              |
| BR-034 | User dapat memiliki banyak role.                                                                                     |
| BR-035 | Guru dapat menjadi Wali Kelas.                                                                                       |
| BR-036 | Data dipisahkan berdasarkan periode.                                                                                 |
| BR-037 | Admin dapat mengedit data Madrasah.                                                                                  |
| BR-038 | Izin/sakit disetujui memengaruhi presensi.                                                                           |
| BR-039 | Toleransi datang 10 menit.                                                                                           |
| BR-040 | Pulang >10 menit sebelum jadwal efektif → Pulang Cepat.                                                              |
| BR-041 | Jam aktif datang -60/+120 menit.                                                                                     |
| BR-042 | Jam aktif pulang -120/+180 menit.                                                                                    |
| BR-043 | Tidak ada datang tetapi ada pulang → Terlambat.                                                                      |
| BR-044 | Lampiran maksimal 1 file, PDF/JPG/JPEG/PNG, maksimal 2 MB, opsional.                                                 |
| BR-045 | Export XLSX dan PDF.                                                                                                 |
| BR-046 | Dashboard default periode aktif + hari ini.                                                                          |
| BR-047 | Notifikasi hanya in-app.                                                                                             |
| BR-048 | Tanggal khusus diprioritaskan sebelum jadwal standar.                                                                |
| BR-049 | Override diterapkan setelah jadwal dasar tanggal ditentukan.                                                         |

---

## 33. Acceptance Criteria Utama

Aplikasi memenuhi spesifikasi utama apabila:

1. Login dan authorization berjalan sesuai role.
2. Admin dapat mengelola user dan role.
3. Guru dan siswa dapat diimport melalui Excel.
4. Data terisolasi berdasarkan periode.
5. Geofence 200 meter dapat digunakan.
6. Akurasi GPS minimum 30 meter divalidasi.
7. Presensi datang/pulang guru berjalan.
8. Guru tidak dapat mengubah presensi langsung.
9. Guru dapat mengajukan koreksi.
10. Admin dapat mengoreksi presensi.
11. Koreksi tercatat di audit trail.
12. Semua guru dapat scan semua siswa.
13. QR NISN dapat dibaca.
14. Verifikasi manual siswa tersedia.
15. Scanner ID tersimpan.
16. Lokasi dan jarak presensi tersimpan.
17. Duplicate attendance ditolak.
18. Toleransi datang 10 menit diterapkan.
19. Toleransi pulang cepat 10 menit diterapkan.
20. Jam aktif datang/pulang diterapkan.
21. Tidak ada arrival + ada departure menghasilkan Terlambat.
22. Ada arrival + tidak ada departure menghasilkan Belum Absen Pulang setelah periode berakhir.
23. Tidak ada arrival + tidak ada departure menghasilkan Alpa sesuai aturan.
24. Approval izin memengaruhi presensi.
25. Admin dapat membatalkan approval.
26. Pembatalan mengembalikan status ke Pending.
27. Dashboard menyediakan filter utama.
28. Laporan harian, mingguan, dan bulanan tersedia.
29. Export XLSX dan PDF tersedia.
30. Guidance tersedia untuk kondisi penting.
31. Audit hanya dapat dilihat Admin dan Kepala Madrasah.
32. Informasi perangkat tidak dicatat.
33. Tanggal khusus dan libur diprioritaskan.
34. Override guru dapat mengubah jadwal efektif lebih awal/lambat.

---

## 34. Prioritas Pengembangan

### P0 — Fondasi

- Authentication
- User & Role
- Master Data
- Tahun Pelajaran/Periode
- Database dasar
- Authorization

### P1 — Presensi Inti

- Geofencing
- Jadwal
- Jam aktif
- Presensi Guru
- QR siswa
- Scanner Guru
- Presensi Siswa
- Anti-duplicate
- Status
- Auto-Alpa

### P2 — Administrasi

- Koreksi
- Audit trail
- Perizinan
- Approval
- Dashboard
- Laporan
- Export
- Import Excel

### P3 — Penyempurnaan

- UI/UX refinement
- Guidance/notifikasi
- Validasi tambahan
- Optimasi
- Testing
- Deployment

---

## 35. Batasan Ruang Lingkup

Tidak termasuk dalam spesifikasi saat ini:

- jadwal pelajaran;
- presensi berdasarkan mata pelajaran;
- QR dinamis;
- reset QR;
- biometrik siswa;
- email notification;
- WhatsApp notification;
- push notification eksternal;
- pencatatan informasi perangkat;
- koreksi langsung oleh guru;
- payroll;
- perhitungan gaji;
- modul akademik di luar presensi;
- integrasi eksternal yang belum ditentukan.

Kebutuhan baru harus dianalisis dan dimasukkan melalui revisi spesifikasi.

---

## 36. Kesimpulan

Sistem berfokus pada presensi Madrasah yang sederhana dan terukur melalui:

```text
User & Role
    ↓
Master Data
    ↓
Tahun Pelajaran
    ↓
Jadwal Efektif
    ↓
Geofencing
    ↓
Presensi Guru / QR Siswa
    ↓
Status Kehadiran
    ↓
Auto-Alpa
    ↓
Koreksi & Audit
    ↓
Perizinan & Approval
    ↓
Dashboard & Laporan
    ↓
Export
```

Dokumen ini merupakan spesifikasi aplikasi final berbasis BRD Final v1.3 dan dapat digunakan sebagai dasar untuk tahap berikutnya: UI/UX, Data Model, development prompt, implementasi, testing, dan deployment.
