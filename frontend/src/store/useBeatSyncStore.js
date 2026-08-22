import { create } from "zustand";
import { api } from "../api/client";

export const useBeatSyncStore = create((set, get) => ({
  theme: localStorage.getItem("beatsync-theme") || "light",
  language: localStorage.getItem("beatsync-language") || "en",

  // --------------------------------
  // DATA FETCHING
  // --------------------------------
  managedStores: [],
  managedProducts: [],
  deliveryBoys: [],
  distributorInfo: null,
  isLoadingStores: false,
  isLoadingProducts: false,
  
  fetchDistributorInfo: async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.success) {
        set({ distributorInfo: res.data.user });
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchStores: async () => {
    set({ isLoadingStores: true });
    try {
      const res = await api.get("/stores");
      if (res.success) {
        set({ managedStores: res.data.stores });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoadingStores: false });
    }
  },

  fetchProducts: async () => {
    set({ isLoadingProducts: true });
    try {
      const res = await api.get("/skus");
      if (res.success) {
        set({ managedProducts: res.data.skus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoadingProducts: false });
    }
  },



  addStore: async (storeDetails) => {
    try {
      const res = await api.post("/stores", {
        name: storeDetails.name,
        locality: storeDetails.location,
        phone: storeDetails.phone,
        ownerName: storeDetails.ownerName || "",
        outstandingBalance: storeDetails.outstandingBalance ? Number(storeDetails.outstandingBalance) : 0,
      });
      if (res.success) {
        // Refresh stores
        get().fetchStores();
      }
    } catch (err) {
      console.error(err);
    }
  },

  addProduct: async (productDetails) => {
    try {
      const payload = {
        name: productDetails.name,
        price: Number(productDetails.price) || 0,
        unit: productDetails.unit || "unit",
      };
      if (productDetails.code) {
        payload.code = productDetails.code;
      }
      const res = await api.post("/skus", payload);
      if (res.success) {
        // Refresh products
        get().fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  },

  // --------------------------------
  // BEAT GENERATOR STATE
  // --------------------------------

  beatGenerated: false,
  beatPublished: false,
  currentBeatId: null,
  beatColumns: [],
  beatUnassigned: [],
  selectedBoy: "all",
  closedDays: {},
  selectedStore: null,
  search: "",
  sort: "highest",
  assignedStores: {},
  unassignedStores: [],
  dashboardData: null,
  distributorInfo: null,
  deliveryBoys: [],

  fetchDistributorInfo: async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.success) {
        set({ distributorInfo: res.data.user });
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchTeam: async () => {
    try {
      const res = await api.get("/team");
      if (res.success) {
        set({ deliveryBoys: res.data.team });
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchDashboardData: async () => {
    try {
      const res = await api.get("/dashboard/owner");
      if (res.success) {
        set({ dashboardData: res.data });
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  },

  generateBeat: async () => {
    try {
      // API call to backend to generate
      const res = await api.post("/beats/generate");
      if (res.success) {
        set({
          beatGenerated: true,
          beatPublished: false,
          currentBeatId: res.data.beat.id,
        });
        return res.data; // Return the generated beat to the component
      } else if (res.message === "A beat already exists for this date") {
        // fetch existing beat
        const existingRes = await api.get(`/beats/${res.data.beatId}`);
        if (existingRes.success) {
          set({
            beatGenerated: true,
            beatPublished: existingRes.data.beat.status === "published",
            currentBeatId: existingRes.data.beat.id,
          });
          return existingRes.data;
        }
      }
      return res;
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "An error occurred" };
    }
  },

  publishBeat: async () => {
    try {
      const { currentBeatId } = get();
      if (!currentBeatId) return;
      const res = await api.post(`/beats/${currentBeatId}/publish`);
      if (res.success) {
        set({
          beatPublished: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  // Client-side interactions for beat assignments (might need backend sync)
  assignStore: (storeId, boyId) => {},
  removeStore: (storeId, boyId) => {},
  unassignStore: (storeId) => {},

  // --------------------------------
  // THEME
  // --------------------------------

  setTheme: (theme) => {
    localStorage.setItem("beatsync-theme", theme);
    set({ theme });
  },

  setLanguage: (language) => {
    localStorage.setItem("beatsync-language", language);
    set({ language });
  },

  saveSettings: () => {
      return { settingsSavedAt: Date.now() };
  },

  // --------------------------------
  // OTHER STATE
  // --------------------------------

  setSelectedBoy: (selectedBoy) =>
    set({ selectedBoy }),

  closeDay: (boyId) =>
    set((state) => ({
      closedDays: {
        ...state.closedDays,
        [boyId]: true,
      },
    })),

  setSelectedStore: (selectedStore) =>
    set({ selectedStore }),

  setSearch: (search) =>
    set({ search }),

  setSort: (sort) =>
    set({ sort }),

  setBeatColumns: (beatColumns) =>
    set({ beatColumns }),

  setBeatUnassigned: (beatUnassigned) =>
    set({ beatUnassigned }),
}));