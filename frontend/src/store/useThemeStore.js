import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("polychat9-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("polychat9-theme", theme);
    set({ theme });
  },
}));
