import { supabase } from '@/lib/supabaseClient';
import type { User, Role, UserFormData, UserListResult, UserSingleResult, UserMutationResult, RolesListResult } from './types';

export const userService = {
  async list(): Promise<UserListResult> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_roles (
          role:roles ( id, code, name, description )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const usersWithRoles: User[] = (data ?? []).map((u: any) => ({
      ...u,
      roles: u.user_roles?.map((ur: any) => ur.role).filter(Boolean) ?? [],
    }));

    return { data: usersWithRoles, error: null };
  },

  async getById(id: string): Promise<UserSingleResult> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_roles (
          role:roles ( id, code, name, description )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: 'User tidak ditemukan' };
    }

    const user: User = {
      ...data,
      roles: data.user_roles?.map((ur: any) => ur.role).filter(Boolean) ?? [],
    };

    return { data: user, error: null };
  },

  async create(userData: UserFormData): Promise<UserMutationResult> {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password!,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
        is_active: userData.is_active,
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: 'Gagal membuat user auth' };
    }

    // 2. Update profile in public.users (trigger handles basic insert, but we update with full data)
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: userData.full_name,
        phone: userData.phone ?? null,
        is_active: userData.is_active,
      })
      .eq('id', userId);

    if (profileError) {
      // Try to clean up auth user
      await supabase.auth.admin.deleteUser(userId);
      return { success: false, error: profileError.message };
    }

    // 3. Assign roles
    if (userData.role_ids.length > 0) {
      const roleInserts = userData.role_ids.map((role_id) => ({ user_id: userId, role_id }));
      const { error: roleError } = await supabase.from('user_roles').insert(roleInserts);
      if (roleError) {
        await supabase.auth.admin.deleteUser(userId);
        return { success: false, error: roleError.message };
      }
    }

    return { success: true, error: null };
  },

  async update(id: string, userData: Partial<UserFormData>): Promise<UserMutationResult> {
    // Update profile
    const updates: any = {};
    if (userData.full_name !== undefined) updates.full_name = userData.full_name;
    if (userData.phone !== undefined) updates.phone = userData.phone;
    if (userData.is_active !== undefined) updates.is_active = userData.is_active;

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);

      if (profileError) {
        return { success: false, error: profileError.message };
      }
    }

    // Update auth user if email or password changed
    if (userData.email || userData.password) {
      const authUpdates: any = {};
      if (userData.email) authUpdates.email = userData.email;
      if (userData.password) authUpdates.password = userData.password;
      authUpdates.email_confirm = true;

      const { error: authError } = await supabase.auth.admin.updateUserById(id, authUpdates);
      if (authError) {
        return { success: false, error: authError.message };
      }
    }

    // Update roles if provided
    if (userData.role_ids !== undefined) {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      // Insert new roles
      if (userData.role_ids.length > 0) {
        const roleInserts = userData.role_ids.map((role_id) => ({ user_id: id, role_id }));
        const { error: roleError } = await supabase.from('user_roles').insert(roleInserts);
        if (roleError) {
          return { success: false, error: roleError.message };
        }
      }
    }

    return { success: true, error: null };
  },

  async delete(id: string): Promise<UserMutationResult> {
    // Delete from auth (cascades to public.users via trigger)
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  },

  async toggleActive(id: string, isActive: boolean): Promise<UserMutationResult> {
    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },

  async listRoles(): Promise<RolesListResult> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('code', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Role[], error: null };
  },
};