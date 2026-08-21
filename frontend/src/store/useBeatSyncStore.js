import { create } from "zustand";
import { stores, deliveryBoys, } from "../data/mockData";

export const useBeatSyncStore = create((set) => ({
  theme: localStorage.getItem("beatsync-theme") || "light",

  beatGenerated: false,
  beatPublished: false,
    // --------------------------------
  // BEAT GENERATOR STATE
  // --------------------------------

  beatColumns: deliveryBoys.map((boy) => ({
    ...boy,
    assigned: [],
  })),

  beatUnassigned: [],

  selectedBoy: "all",
  closedDays: {},
  selectedStore: null,
  search: "",
  sort: "highest",

  // --------------------------------
  // BEAT ASSIGNMENTS
  // --------------------------------

  assignedStores: stores.reduce((acc, store) => {
    if (store.boyId) {
      if (!acc[store.boyId]) {
        acc[store.boyId] = [];
      }

      acc[store.boyId].push(store.id);
    }

    return acc;
  }, {}),

  unassignedStores: stores
    .filter((store) => !store.boyId)
    .map((store) => store.id),

  // --------------------------------
  // THEME
  // --------------------------------

  setTheme: (theme) => {
    localStorage.setItem("beatsync-theme", theme);
    set({ theme });
  },

  // --------------------------------
  // BEAT STATUS
  // --------------------------------

  generateBeat: () =>
    set({
      beatGenerated: true,
      beatPublished: false,
    }),

  publishBeat: () =>
    set({
      beatPublished: true,
    }),

  // --------------------------------
  // STORE ASSIGNMENT
  // --------------------------------

  assignStore: (storeId, boyId) =>
    set((state) => {
      const newAssigned = {
        ...state.assignedStores,
      };

      // Remove store from every existing boy
      Object.keys(newAssigned).forEach((id) => {
        newAssigned[id] = newAssigned[id].filter(
          (id) => id !== storeId
        );
      });

      // Add store to selected boy
      if (!newAssigned[boyId]) {
        newAssigned[boyId] = [];
      }

      newAssigned[boyId] = [
        ...newAssigned[boyId],
        storeId,
      ];

      return {
        assignedStores: newAssigned,

        unassignedStores:
          state.unassignedStores.filter(
            (id) => id !== storeId
          ),
      };
    }),

  // --------------------------------
  // REMOVE STORE FROM BOY
  // --------------------------------

  removeStore: (storeId, boyId) =>
    set((state) => ({
      assignedStores: {
        ...state.assignedStores,
        [boyId]: (
          state.assignedStores[boyId] || []
        ).filter((id) => id !== storeId),
      },

      unassignedStores: [
        ...state.unassignedStores,
        storeId,
      ],
    })),

  // --------------------------------
  // UNASSIGN STORE
  // --------------------------------

  unassignStore: (storeId) =>
    set((state) => {
      const newAssigned = {
        ...state.assignedStores,
      };

      Object.keys(newAssigned).forEach((boyId) => {
        newAssigned[boyId] =
          newAssigned[boyId].filter(
            (id) => id !== storeId
          );
      });

      return {
        assignedStores: newAssigned,

        unassignedStores: state.unassignedStores.includes(
          storeId
        )
          ? state.unassignedStores
          : [
              ...state.unassignedStores,
              storeId,
            ],
      };
    }),

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

    // --------------------------------
  // BEAT GENERATOR
  // --------------------------------

  setBeatColumns: (beatColumns) =>
    set({ beatColumns }),

  setBeatUnassigned: (beatUnassigned) =>
    set({ beatUnassigned }),
}));