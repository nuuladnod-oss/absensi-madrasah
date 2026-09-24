export interface Madrasah {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  geofence_radius_meter: number;
  max_gps_accuracy_meter: number;
  created_at: string;
  updated_at: string;
}

export interface MadrasahFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofence_radius_meter: number;
  max_gps_accuracy_meter: number;
}

export const DEFAULT_GEOFENCE_RADIUS = 200;
export const DEFAULT_MAX_GPS_ACCURACY = 30;

export const validateMadrasahForm = (data: MadrasahFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Nama madrasah wajib diisi';
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }

  if (data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }

  if (data.geofence_radius_meter <= 0) {
    errors.geofence_radius_meter = 'Radius geofence harus lebih dari 0';
  }

  if (data.max_gps_accuracy_meter <= 0) {
    errors.max_gps_accuracy_meter = 'Akurasi GPS maksimal harus lebih dari 0';
  }

  return errors;
};