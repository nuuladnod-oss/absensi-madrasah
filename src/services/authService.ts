import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export type SessionState = 'loading' | 'authenticated' | 'unauthenticated' | 'expired' | 'error';

export interface LoginResult {
  ok: boolean;
  state: SessionState;
  /** User-facing Bahasa Indonesia message (no stack traces). */
  message: string;
}

export interface ProfileSummary {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

const INACTIVE_MESSAGE = 'Akun Anda dinonaktifkan. Hubungi Admin.';
const CREDENTIAL_MESSAGE = 'Email atau kata sandi tidak cocok.';

/**
 * AuthService wraps Supabase Auth for login/logout/session.
 * No registration, no OAuth third-party, no biometrics (010 §7).
 * No device info is stored anywhere.
 */
class AuthService {
  private session: Session | null = null;

  /** Return the current cached session (or null). */
  getSession(): Session | null {
    return this.session;
  }

  /** Force-refresh the cached session from Supabase. */
  async refreshSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      this.session = null;
      return null;
    }
    this.session = data.session ?? null;
    return this.session;
  }

  /**
   * Log in with email + password.
   * After successful auth, verifies the application profile exists and is active.
   * An inactive account is rejected with the exact message required by 007/010.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
      return { ok: false, state: 'error', message: CREDENTIAL_MESSAGE };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Supabase returns generic auth errors for bad credentials; map to the
      // exact required message. Any other auth error is also surfaced as a
      // generic credential failure to avoid leaking system details.
      return { ok: false, state: 'error', message: CREDENTIAL_MESSAGE };
    }

    const session = data.session;
    if (!session) {
      return { ok: false, state: 'error', message: CREDENTIAL_MESSAGE };
    }

    this.session = session;

    // Verify application profile + active status.
    const profile = await this.loadProfile(session.user.id);
    if (!profile) {
      await this.logout();
      return {
        ok: false,
        state: 'error',
        message: 'Profil pengguna tidak ditemukan. Hubungi Admin.',
      };
    }

    if (!profile.isActive) {
      await this.logout();
      return { ok: false, state: 'error', message: INACTIVE_MESSAGE };
    }

    return { ok: true, state: 'authenticated', message: '' };
  }

  /** Log out and clear the cached session. */
  async logout(): Promise<void> {
    this.session = null;
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // Best-effort: session is already cleared locally.
    }
  }

  /**
   * Load the application profile for a given auth user id.
   * Uses the `users` table which is RLS-protected (own profile or admin).
   */
  async loadProfile(userId: string): Promise<ProfileSummary | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, is_active')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      isActive: data.is_active,
    };
  }
}

export const authService = new AuthService();