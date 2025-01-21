import { create } from "zustand";
import type { AdvancedUser } from "../definitions";

type UserStore = {
  userData: AdvancedUser | null;
  setUserData: (userData: AdvancedUser | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
}));
