import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Distributor = {
  id: string;
  name: string;
  location: string;
  code: string;
};

type DistributorContextType = {
  distributors: Distributor[];
  selectedDistributor: Distributor | null;

  addDistributor: (distributor: Distributor) => void;
  selectDistributor: (distributor: Distributor) => void;
  removeDistributor: (id: string) => void;
};

const DistributorContext = createContext<
  DistributorContextType | undefined
>(undefined);

const STORAGE_KEY = "beatsync_distributors";

export function DistributorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributor, setSelectedDistributor] =
    useState<Distributor | null>(null);

  // Load saved distributors
  useEffect(() => {
    const loadDistributors = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed: Distributor[] = JSON.parse(saved);
          setDistributors(parsed);
        }
      } catch (error) {
        console.log("Failed to load distributors:", error);
      }
    };

    loadDistributors();
  }, []);

  // Save distributors whenever they change
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(distributors)
    ).catch((error) => {
      console.log("Failed to save distributors:", error);
    });
  }, [distributors]);

  const addDistributor = (distributor: Distributor) => {
    setDistributors((current) => {
      // Prevent duplicate distributors
      const alreadyExists = current.some(
        (item) => item.id === distributor.id
      );

      if (alreadyExists) {
        return current;
      }

      return [...current, distributor];
    });
  };

  const selectDistributor = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
  };

  const removeDistributor = (id: string) => {
    setDistributors((current) =>
      current.filter((item) => item.id !== id)
    );

    setSelectedDistributor((current) =>
      current?.id === id ? null : current
    );
  };

  return (
    <DistributorContext.Provider
      value={{
        distributors,
        selectedDistributor,
        addDistributor,
        selectDistributor,
        removeDistributor,
      }}
    >
      {children}
    </DistributorContext.Provider>
  );
}

export function useDistributor() {
  const context = useContext(DistributorContext);

  if (!context) {
    throw new Error(
      "useDistributor must be used within DistributorProvider"
    );
  }

  return context;
}