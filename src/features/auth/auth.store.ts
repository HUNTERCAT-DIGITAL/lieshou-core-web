/** 认证会话状态（zustand · 平台无关） */
import { create } from 'zustand';

export interface Session {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  username: string | null;
  tenantCode: string | null;
  tenantName: string | null;
}

interface AuthState {
  session: Session;
  initialized: boolean;
  setSession: (s: Session) => void;
  clear: () => void;
}

const empty: Session = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  username: null,
  tenantCode: null,
  tenantName: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  session: empty,
  initialized: false,
  setSession: (session) => set({ session, initialized: true }),
  clear: () => set({ session: empty }),
}));
