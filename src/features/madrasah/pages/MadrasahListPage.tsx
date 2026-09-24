import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { StateAlert } from '@/components/ui/StateAlert';
import { Button } from '@/components/ui/Button';
import { ModalConfirm } from '@/components/ui/ModalConfirm';
import { useMadrasah } from '../hooks/useMadrasah';
import { MadrasahForm } from '../components/MadrasahForm';
import type { Madrasah, MadrasahFormData } from '../types';

export function MadrasahListPage() {
  const { madrasahList, error, fetchList, create, update, remove } = useMadrasah();
  const [showForm, setShowForm] = useState(false);
  const [editingMadrasah, setEditingMadrasah] = useState<Madrasah | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: MadrasahFormData) => {
    setFormLoading(true);
    const result = await create(data);
    setFormLoading(false);
    if (result.success) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (data: MadrasahFormData) => {
    if (!editingMadrasah) return;
    setFormLoading(true);
    const result = await update(editingMadrasah.id, data);
    setFormLoading(false);
    if (result.success) {
      setShowForm(false);
      setEditingMadrasah(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await remove(deletingId);
    setDeletingId(null);
  };

  const columns = [
    { key: 'name', header: 'Nama Madrasah', render: (row: Madrasah) => <span className="font-medium">{row.name}</span> },
    { key: 'address', header: 'Alamat', render: (row: Madrasah) => row.address ?? '—', className: 'max-w-xs truncate' },
    {
      key: 'coordinates',
      header: 'Koordinat',
      render: (row: Madrasah) => (
        <span className="font-mono text-xs">
          {row.latitude.toFixed(6)}, {row.longitude.toFixed(6)}
        </span>
      ),
    },
    {
      key: 'geofence',
      header: 'Radius Geofence',
      render: (row: Madrasah) => <span>{row.geofence_radius_meter}m</span>,
      className: 'text-center',
    },
    {
      key: 'accuracy',
      header: 'Akurasi GPS Max',
      render: (row: Madrasah) => <span>{row.max_gps_accuracy_meter}m</span>,
      className: 'text-center',
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row: Madrasah) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingMadrasah(row)}
            className="h-8 px-2"
            aria-label={`Edit ${row.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingId(row.id)}
            className="h-8 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
            aria-label={`Hapus ${row.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      ),
      className: 'text-center',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Madrasah"
        subtitle="Kelola data madrasah termasuk koordinat GPS, radius geofence, dan akurasi GPS maksimal."
        actions={
          <Button variant="primary" onClick={() => { setEditingMadrasah(null); setShowForm(true); }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Madrasah
          </Button>
        }
      />

      {error && (
        <StateAlert variant="error" title="Gagal Memuat Data" message={error} onRetry={fetchList} retryLabel="Coba Lagi" />
      )}

      <ResponsiveTable
        data={madrasahList}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyState={
          <StateAlert
            variant="info"
            title="Belum Ada Data Madrasah"
            message="Tambah madrasah pertama untuk memulai. Minimal satu madrasah diperlukan untuk sistem absensi."
          />
        }
        caption="Daftar madrasah terdaftar"
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingMadrasah ? 'Edit Madrasah' : 'Tambah Madrasah'}
              </h3>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingMadrasah(null); }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
                aria-label="Tutup form"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <MadrasahForm
                initialData={editingMadrasah ? {
                  name: editingMadrasah.name,
                  address: editingMadrasah.address,
                  latitude: editingMadrasah.latitude,
                  longitude: editingMadrasah.longitude,
                  geofence_radius_meter: editingMadrasah.geofence_radius_meter,
                  max_gps_accuracy_meter: editingMadrasah.max_gps_accuracy_meter,
                } : null}
                onSubmit={editingMadrasah ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingMadrasah(null); }}
                loading={formLoading}
                title={editingMadrasah ? 'Edit Madrasah' : 'Tambah Madrasah'}
              />
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <ModalConfirm
          open
          onClose={() => setDeletingId(null)}
          onConfirm={handleDeleteConfirm}
          title="Hapus Madrasah"
          description="Apakah Anda yakin ingin menghapus madrasah ini? Tindakan ini tidak dapat dibatalkan dan akan memengaruhi data guru, siswa, dan jadwal yang terkait."
          confirmLabel="Ya, Hapus"
          cancelLabel="Batal"
          variant="danger"
        />
      )}
    </div>
  );
}

export default MadrasahListPage;