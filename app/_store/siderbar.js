import { create } from "zustand";

const initialState = {
  isCollapsed: false,
};

export const useSidebarStore = create((set) => ({
  body: initialState,
  setBody: (payload) =>
    set((state) => ({ body: { ...state.body, ...payload } })),
}));
