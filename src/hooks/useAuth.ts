import { useState, useEffect, useCallback } from 'react';
import { authService, type SessionState, type ProfileSummary } from '@/services/authService';

export interface AuthContextValue {
  state: SessionState;
  session: ReturnType<typeof authService.getSession>;
  profile: ProfileSummary | null;
  error: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useAuth hook manages session state.
 * States: loading, authenticated, unauthenticated, expired, error.
 * Bahasa Indonesia messages only, no stack traces.
 */
export function useAuth() {
  const [state, setState] = useState<SessionState>('loading');
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    try {
      const session = await authService.refreshSession();
      if (!session) {
        setState('unauthenticated');
        setProfile(null);
        return;
      }
      const p = await authService.loadProfile(session.user.id);
      if (!p) {
        await authService.logout();
        setState('unauthenticated');
        setProfile(null);
        return;
      }
      if (!p.isActive) {
        await authService.logout();
        setState('error');
        setError('Akun Anda dinonaktifkan. Hubungi Admin.');
        setProfile(null);
        return;
      }
      setProfile(p);
      setState('authenticated');
    } catch {
      setState('error');
      setError('Sesi tidak dapat dipulihkan. Silakan login kembali.');
    }
  }, []);

  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const result = await authService.login(email, password);
      if (result.ok) {
        setState('authenticated');
        const session = authService.getSession();
        if (session) {
          const p = await authService.loadProfile(session.user.id);
          setProfile(p);
        }
        return { ok: true, message: result.message };
      }
      setState('error');
      setError(result.message);
      return { ok: false, message: result.message };
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setState('unauthenticated');
    setProfile(null);
    setError(null);
  }, []);

  return {
    state,
    session: authService.getSession(),
    profile,
    error,
    login,
    logout,
    refresh: sync,
  };
}

export default useAuth;