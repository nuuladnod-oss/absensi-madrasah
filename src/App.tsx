import MainLayout from '@/layouts/MainLayout';

/**
 * Placeholder root component for the foundation phase.
 * AppShell + navigation are wired here so Task 0.3 can be verified
 * end-to-end before real routes are introduced (Fase 1).
 */
function App() {
  return (
    <MainLayout
      institutionName="MAS Al-Hikmah"
      institutionSubtitle="Sistem Presensi GPS & QR Code"
      activePeriod="2026/2027 Ganjil"
      userName="Pengguna"
      userRole="Peran"
      userInitials="PG"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-slate-800">App berjalan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Foundation siap. Lanjutkan dengan task berikutnya.
        </p>
      </div>
    </MainLayout>
  );
}

export default App;