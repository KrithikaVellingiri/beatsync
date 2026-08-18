import { create } from "zustand";

export const useBeatSyncStore = create((set) => ({
  theme: localStorage.getItem("beatsync-theme") || "light",
  beatGenerated: false,
  beatPublished: false,
  selectedBoy: "all",
  selectedStore: null,
  search: "",
  sort: "highest",
  setTheme: (theme) => {
    localStorage.setItem("beatsync-theme", theme);
    set({ theme });
  },
  generateBeat: () => set({ beatGenerated: true, beatPublished: false }),
  publishBeat: () => set({ beatPublished: true }),
  setSelectedBoy: (selectedBoy) => set({ selectedBoy }),
  setSelectedStore: (selectedStore) => set({ selectedStore }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
}));
