import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAdminAccessStore = create(
  persist(
    (set, get) => ({
      access: null,
      setAccess: (payload) => set({ access: payload }),
      getAccess: () => get().access,
      clearAccess: () => {
        set({ access: null });
      },
    }),
    {
      name: "access-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
