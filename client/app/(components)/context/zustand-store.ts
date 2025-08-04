import { create } from "zustand";
import { persist } from "zustand/middleware";


type AuthState = {
  accessToken: string | null;
};

type AuthAction = {
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState & AuthAction>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: "auth",
    }
  )
);