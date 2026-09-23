import { supabase } from '@/lib/supabaseClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
    is_active?: boolean;
  };
}

export interface AuthError {
  message: string;
  code?: string;
}

export async function signIn(credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { user: null, error: { message: error.message, code: error.code } };
  }

  if (!data.user) {
    return { user: null, error: { message: 'Email atau kata sandi tidak cocok' } };
  }

  // Check if user is active via user_metadata
  const isActive = data.user.user_metadata?.is_active !== false;
  if (!isActive) {
    await supabase.auth.signOut();
    return { user: null, error: { message: 'Akun Anda dinonaktifkan. Hubungi Admin.' } };
  }

  const user: AuthUser = {
    id: data.user.id,
    email: data.user.email ?? '',
    user_metadata: data.user.user_metadata,
  };

  return { user, error: null };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: { message: error.message } };
  }
  return { error: null };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata,
  };
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user: AuthUser = {
        id: session.user.id,
        email: session.user.email ?? '',
        user_metadata: session.user.user_metadata,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
  return subscription;
}