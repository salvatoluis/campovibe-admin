import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminRole = 'admin' | 'dean' | 'super_admin';

export interface AdminUser {
  id: string; email: string; firstName: string; lastName: string;
  role: AdminRole; tenantId: string;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  setAuth: (user: AdminUser, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  can: (roles: AdminRole[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('cv_admin_token', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('cv_admin_token');
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
      can: (roles) => {
        const role = get().user?.role;
        if (role === 'super_admin') return true;
        return role ? roles.includes(role) : false;
      },
    }),
    { name: 'cv-admin-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
