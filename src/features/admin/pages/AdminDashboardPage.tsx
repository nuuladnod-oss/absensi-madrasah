import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { StateAlert } from '@/components/ui/StateAlert';
import { Button } from '@/components/ui/Button';

export function AdminDashboardPage() {
  const periodBadge = { label: 'Periode', text: 'TA 2026/2027 Ganjil (Aktif)' };

  const metricCards = [
    {
      label: 'Siswa Terdaftar',
      value: '420',
      helper: '/ 420 Total',
      trend: { label: 'Target ≥95%', tone: 'neutral' as const },
      footer: [
        { key: 'Hadir', value: '388' },
        { key: 'Terlambat', value: '14' },
        { key: 'Izin/Sakit', value: '8' },
        { key: 'Tanpa Kabar', value: '10' },
      ],
    },
    {
      label: 'Guru & Staf',
      value: '34',
      helper: '/ 34 Total Pendidik',
      trend: { label: 'Kehadiran 94.1%', tone: 'positive' as const },
      footer: [
        { key: 'Hadir', value: '31' },
        { key: 'Terlambat', value: '1' },
        { key: 'Izin/Dinas', value: '2' },
      ],
    },
    {
      label: 'Antrean Izin Menunggu',
      value: '3',
      helper: 'Butuh Persetujuan',
      trend: { label: 'Fallback BR-033', tone: 'warning' as const },
    },
    {
      label: 'Koreksi Presensi Guru',
      value: '2',
      helper: 'Pengajuan Menunggu',
      trend: { label: 'BR-019 / FS-CORR', tone: 'info' as const },
    },
  ];

  const tableColumns = [
    { key: 'name', header: 'Nama', render: (row: { name: string }) => row.name },
    { key: 'role', header: 'Peran', render: (row: { role: string }) => row.role },
    { key: 'class', header: 'Kelas / Mata Pelajaran', render: (row: { class: string }) => row.class },
    { key: 'type', header: 'Jenis', render: (row: { type: string }) => row.type },
    { key: 'status', header: 'Status', render: (row: { status: string }) => row.status },
    { key: 'action', header: 'Aksi', render: () => '—', className: 'text-center' },
  ];

  const emptyTableData: Array<{ name: string; role: string; class: string; type: string; status: string }> = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Operasional Admin"
        subtitle="Ringkasan presensi harian madrasah, status GPS geofencing, dan antrean persetujuan operasional madrasah secara real-time."
        periodBadge={periodBadge}
      />

      {/* Operational Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <div className="font-medium text-slate-900">Jendela Presensi Datang Aktif</div>
            <p className="text-sm text-slate-500">Pintu gerbang & pindaian barcode dibuka (06:00 - 09:00 WIB). Sesi absensi pulang dijadwalkan otomatis terbuka pada pukul 13:00 WIB.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <div className="font-medium text-slate-900">Tindakan Cepat Dibutuhkan (Fallback BR-033)</div>
            <p className="text-sm text-slate-500">3 pengajuan izin siswa membutuhkan persetujuan Admin karena Wali Kelas bersangkutan berhalangan hadir hari ini.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      {/* Pending Queues - Approval & Corrections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Antrean Persetujuan Izin</h4>
                <p className="text-xs text-slate-500">Menunggu verifikasi admin sebagai pengesah darurat</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">3 Menunggu</span>
          </div>

          <StateAlert
            variant="info"
            hideIcon
            message="Belum ada data nyata. Data akan diisi dari Fase 10 (Dashboard & Laporan)."
            className="p-3 text-sm"
          />
        </div>

        {/* Corrections Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Koreksi Presensi Guru</h4>
                <p className="text-xs text-slate-500">Pencatatan koreksi jam atau status kehadiran guru</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">2 Pengajuan</span>
          </div>

          <StateAlert
            variant="info"
            hideIcon
            message="Belum ada data nyata. Data akan diisi dari Fase 10 (Dashboard & Laporan)."
            className="p-3 text-sm"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">Pintasan Aksi Harian</h4>
            <p className="text-xs text-slate-500">Jalan pintas pekerjaan rutin administrasi tanpa navigasi bertingkat</p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold">1-Click Shortcut</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full justify-start gap-3 p-4 rounded-lg hover:bg-slate-50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-900">Presensi Manual</div>
              <div className="text-xs text-slate-500">Catat presensi siswa bila QR rusak/hilang</div>
            </div>
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 p-4 rounded-lg hover:bg-slate-50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-900">Tambah User Baru</div>
              <div className="text-xs text-slate-500">Registrasi siswa, guru, atau wali kelas</div>
            </div>
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 p-4 rounded-lg hover:bg-slate-50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-900">Unduh Rekap (XLSX)</div>
              <div className="text-xs text-slate-500">Format resmi Emis/Simpatika harian</div>
            </div>
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 p-4 rounded-lg hover:bg-slate-50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-900">Cetak QR Siswa</div>
              <div className="text-xs text-slate-500">Cetak kartu fisik per kelas/rombel</div>
            </div>
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-emerald-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">Sensor GPS Madrasah: Optimal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-slate-500">Rata-rata akurasi perangkat 12m (Batas toleransi maksimal: 30m). Radius geofence 200m dari koordinat gerbang utama.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-2.5 rounded-lg shrink-0">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-mono">Scheduler Auto-Alpa (BR-017): <strong>18:00 WIB Hari Ini</strong></span>
        </div>
      </div>

      {/* Empty Table Placeholder */}
      <ResponsiveTable
        data={emptyTableData}
        columns={tableColumns}
        getRowKey={(_, index) => `row-${index}`}
        emptyState={
          <StateAlert
            variant="info"
            title="Data Kosong"
            message="Tabel akan menampilkan data presensi real-time pada Fase 10 (Dashboard & Laporan). Saat ini menggunakan data placeholder dari referensi visual."
          />
        }
        caption="Tabel placeholder untuk data presensi harian (Fase 10)"
      />
    </div>
  );
}

export default AdminDashboardPage;