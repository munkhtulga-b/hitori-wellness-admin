import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { logUserOut } from "../cms/actions";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (payload) => set({ user: payload }),
      getUser: () => get().user,
      logOut: () => {
        set({ user: null });
        Cookies.remove("token");
        logUserOut();
      },
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
