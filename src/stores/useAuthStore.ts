import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  role: 'viewer' | 'admin' | null
  mobile: string | null
  restoreAuth: () => void
  login: (mobile: string, role: 'viewer' | 'admin') => void
  logout: () => void
  setRole: (role: 'viewer' | 'admin') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      mobile: null,
      restoreAuth: () => {
        // localStorage handled by persist
        const state = get()
        if (state.mobile && state.role) {
          set({ isLoggedIn: true })
        }
      },
      login: (mobile, role) => set({ isLoggedIn: true, role, mobile }),
      logout: () => set({ isLoggedIn: false, role: null, mobile: null }),
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

