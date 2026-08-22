import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

export type Distributor = {
  id: string;
  name: string;
  location: string;
  code: string;
};

type DistributorContextType = {
  distributors: Distributor[];
  selectedDistributor: Distributor | null;
  fetchDistributors: () => Promise<void>;
  selectDistributor: (distributor: Distributor) => Promise<void>;
  removeDistributor: (id: string) => void;
};

const DistributorContext = createContext<DistributorContextType | undefined>(undefined);

export function DistributorProvider({ children }: { children: React.ReactNode }) {
  const { token, role, isLoading: authLoading } = useAuth();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);

  const fetchDistributors = async () => {
    try {
      const res = await api.get("/team/distributor/mine");
      if (res.success) {
        const mapped: Distributor[] = res.data.distributors.map((membership: any) => ({
          id: membership.distributor.id.toString(),
          name: membership.distributor.name,
          location: "Location not provided",
          code: membership.distributor.code,
        }));
        setDistributors(mapped);

        // Restore previously selected distributor from storage
        const storedId = await AsyncStorage.getItem("distributor_id");
        let toSelect: Distributor | undefined;

        if (storedId) {
          toSelect = mapped.find((d) => d.id === storedId);
        }
        if (!toSelect && mapped.length > 0) {
          toSelect = mapped[0];
        }
        if (toSelect) {
          setSelectedDistributor(toSelect);
          await AsyncStorage.setItem("distributor_id", toSelect.id);
        }
      }
    } catch (error) {
      console.log("Failed to fetch distributors:", error);
    }
  };

  // Gate fetch on authLoading being false AND token being present.
  // This prevents the race condition where the effect fires before the token is resolved.
  useEffect(() => {
    if (authLoading) return; // still restoring from storage — wait

    if (token && role === "delivery_boy") {
      fetchDistributors();
    } else if (!token) {
      // Logout: clear everything
      setDistributors([]);
      setSelectedDistributor(null);
      AsyncStorage.removeItem("distributor_id").catch(() => {});
    }
  }, [authLoading, token, role]);

  const selectDistributor = async (distributor: Distributor) => {
    // Null guard — never crash if called with null/undefined
    if (!distributor || !distributor.id) {
      console.warn("selectDistributor called with null/undefined — ignoring");
      return;
    }
    setSelectedDistributor(distributor);
    await AsyncStorage.setItem("distributor_id", distributor.id);
  };

  const removeDistributor = (id: string) => {
    setDistributors((current) => current.filter((item) => item.id !== id));
    setSelectedDistributor((current) => (current?.id === id ? null : current));
    AsyncStorage.removeItem("distributor_id").catch(() => {});
  };

  return (
    <DistributorContext.Provider value={{ distributors, selectedDistributor, fetchDistributors, selectDistributor, removeDistributor }}>
      {children}
    </DistributorContext.Provider>
  );
}

export function useDistributor() {
  const context = useContext(DistributorContext);
  if (!context) throw new Error("useDistributor must be used within DistributorProvider");
  return context;
}
