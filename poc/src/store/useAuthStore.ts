import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { AuthState } from '../types/userAuthType';

// Custom storage object for Zustand to talk to cookies
const cookieStorage = {
  getItem: (name: string): string | null => Cookies.get(name) || null,
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7, secure: true, sameSite: 'strict' });
  },
  removeItem: (name: string): void => Cookies.remove(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      bffPublicKey: null,
      isAuthenticated: false,

      setHandshake: (key) => set({ bffPublicKey: key }),
      setAuth: (user, tokens) => set({ user, tokens, isAuthenticated: true }),
      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false, bffPublicKey: null });
        Cookies.remove('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);