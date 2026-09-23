import { useState, useEffect, useCallback } from 'react';
import { AuthUser, signIn, signOut, getCurrentUser, onAuthStateChange } from '@/features/auth/services/authService';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface UseAuthReturn {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const currentUser = await getCurrentUser();
      if (mounted) {
        setUser(currentUser);
        setStatus(currentUser ? 'authenticated' : 'unauthenticated');
      }
    };

    initAuth();

    const subscription = onAuthStateChange((newUser) => {
      if (mounted) {
        setUser(newUser);
        setStatus(newUser ? 'authenticated' : 'unauthenticated');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setStatus('loading');
    setError(null);

    const { user: loggedInUser, error: loginError } = await signIn({ email, password });

    if (loginError) {
      setError(loginError.message);
      setStatus('error');
      setUser(null);
      return;
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      setStatus('authenticated');
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading');
    const { error: logoutError } = await signOut();
    if (logoutError) {
      setError(logoutError.message);
      setStatus('error');
    } else {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  return { user, status, error, login, logout };
}