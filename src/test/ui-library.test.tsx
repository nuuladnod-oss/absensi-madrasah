import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GeofenceIndicator } from '@/components/ui/GeofenceIndicator';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { ModalConfirm } from '@/components/ui/ModalConfirm';
import { StateAlert } from '@/components/ui/StateAlert';

describe('Shared UI component library (Task 0.2)', () => {
  it('renders Button variants', () => {
    const { container } = render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
      </>
    );
    expect(container.querySelectorAll('button').length).toBe(4);
  });

  it('renders all 8 official status labels exactly', () => {
    const labels: Array<'HADIR' | 'TERLAMBAT' | 'PULANG_CEPAT' | 'BELUM_ABSEN_PULANG' | 'ALPA' | 'IZIN' | 'SAKIT' | 'IZIN_MENUNGGU_APPROVAL'> = [
      'HADIR',
      'TERLAMBAT',
      'PULANG_CEPAT',
      'BELUM_ABSEN_PULANG',
      'ALPA',
      'IZIN',
      'SAKIT',
      'IZIN_MENUNGGU_APPROVAL',
    ];

    const { container } = render(
      <>
        {labels.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </>
    );

    expect(screen.getByText('Hadir')).toBeInTheDocument();
    expect(screen.getByText('Terlambat')).toBeInTheDocument();
    expect(screen.getByText('Pulang Cepat')).toBeInTheDocument();
    expect(screen.getByText('Belum Absen Pulang')).toBeInTheDocument();
    expect(screen.getByText('Alpa')).toBeInTheDocument();
    expect(screen.getByText('Izin Resmi')).toBeInTheDocument();
    expect(screen.getByText('Sakit')).toBeInTheDocument();
    expect(screen.getByText('Menunggu Approval')).toBeInTheDocument();
    expect(container.querySelectorAll('span').length).toBe(labels.length);
  });

  it('renders GeofenceIndicator valid and invalid states', () => {
    const { container } = render(
      <>
        <GeofenceIndicator distanceMeter={42.5} accuracyMeter={12} />
        <GeofenceIndicator distanceMeter={245} accuracyMeter={12} />
        <GeofenceIndicator distanceMeter={42} accuracyMeter={40} />
      </>
    );
    expect(container.querySelectorAll('[aria-live="polite"]').length).toBe(3);
  });

  it('renders MetricCard with value and footer', () => {
    render(
      <MetricCard
        label="Kehadiran Hari Ini"
        value={412}
        helper="/ 420 Siswa Terdaftar"
        footer={[
          { key: 'Terlambat', value: '14' },
          { key: 'Alpa', value: '2' },
        ]}
      />
    );
    expect(screen.getByText('Kehadiran Hari Ini')).toBeInTheDocument();
    expect(screen.getByText('412')).toBeInTheDocument();
  });

  it('renders PageHeader with title and period badge', () => {
    render(
      <PageHeader
        title="Presensi Guru Mandiri"
        subtitle="Jadwal hari ini: 07:00 - 14:00 WIB"
        periodBadge={{ label: 'active', text: '2026/2027 Ganjil' }}
      />
    );
    expect(screen.getByText('Presensi Guru Mandiri')).toBeInTheDocument();
    expect(screen.getByText('2026/2027 Ganjil')).toBeInTheDocument();
  });

  it('renders ResponsiveTable with rows and empty state', () => {
    const rows = [{ id: 1, name: 'Ahmad' }, { id: 2, name: 'Nurul' }];
    render(
      <ResponsiveTable
        data={rows}
        columns={[
          { key: 'name', header: 'Nama', render: (r) => r.name },
        ]}
        getRowKey={(r) => String(r.id)}
      />
    );
    expect(screen.getByText('Ahmad')).toBeInTheDocument();
    expect(screen.getByText('Nurul')).toBeInTheDocument();
  });

  it('renders ResponsiveTable empty state', () => {
    render(
      <ResponsiveTable
        data={[]}
        columns={[{ key: 'name', header: 'Nama', render: () => null }]}
        getRowKey={() => 'x'}
        emptyState={<p>Belum ada data.</p>}
      />
    );
    expect(screen.getByText('Belum ada data.')).toBeInTheDocument();
  });

  it('renders ModalConfirm when open', () => {
    render(
      <ModalConfirm
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Setujui Izin?"
        description="Konfirmasi ini tidak dapat dibatalkan."
      />
    );
    expect(screen.getByText('Setujui Izin?')).toBeInTheDocument();
  });

  it('renders StateAlert variants', () => {
    render(
      <>
        <StateAlert variant="success" message="Presensi tersimpan." />
        <StateAlert variant="error" message="GPS ditolak." />
        <StateAlert variant="loading" message="Menghubungkan..." />
      </>
    );
    expect(screen.getByText('Presensi tersimpan.')).toBeInTheDocument();
    expect(screen.getByText('GPS ditolak.')).toBeInTheDocument();
    expect(screen.getByText('Menghubungkan...')).toBeInTheDocument();
  });
});