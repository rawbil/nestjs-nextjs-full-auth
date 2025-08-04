import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  name: string;
  email: string;
};

type Action = {
  updateNameChange: (newName: string) => void;
  updateEmailChange: (newEmail: string) => void;
};

export const useNameStore = create<State & Action>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      updateNameChange: (newName: string) => set({ name: newName }),
      updateEmailChange: (newEmail: string) => set({ email: newEmail }),
    }),
    { name: "user-details" }
  )
);
