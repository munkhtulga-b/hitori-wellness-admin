import { create } from "zustand";

const initialState = {
  studioId: null,
};

export const useCalendarStore = create((set) => ({
  body: initialState,
  setBody: (payload) =>
    set((state) => ({ body: { ...state.body, ...payload } })),
  resetBody: () => set({ body: initialState }),
}));
