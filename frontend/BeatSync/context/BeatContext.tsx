import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import { useDistributor } from "./DistributorContext";
import { Alert } from "react-native";

export type PaymentMethod = "cash" | "upi" | "credit";

export type DraftEntry = {
  delivered: number;
  returned: number;
};

export type CompletedTransaction = {
  storeId: string;
  entries: Record<string, DraftEntry>;
  paymentMethod: PaymentMethod;
  amountCollected: number;
  timestamp: string;
  outstandingAfter: number;
};

export type Product = {
  id: string;
  name: string;
  code: string | null;
  unit: string;
  price: number;
};

export type StoreStatus = "critical" | "clear" | "collectFirst";

export type Store = {
  id: string;
  name: string;
  area: string;
  phone: string;
  outstanding: number;
  daysOverdue: number;
  status: StoreStatus;
  done: boolean;
  insights: string[];
  visitId: string | null;
};

type BeatContextType = {
  stores: Store[];
  products: Product[];
  isLoading: boolean;
  fetchMyBeat: () => Promise<void>;
  getStore: (id: string) => Store | undefined;
  draftEntries: Record<string, DraftEntry>;
  setDelivered: (productId: string, qty: number) => void;
  setReturned: (productId: string, qty: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  amountCollected: number;
  setAmountCollected: (amount: number) => void;
  lastTransaction: CompletedTransaction | null;
  completedTransactions: CompletedTransaction[];
  completeVisit: (storeId: string) => Promise<CompletedTransaction | null>;
  resetDraft: () => void;
  getNextIncompleteStoreId: (excludeId: string) => string | null;
  lastCompletedAt: number;
};

const BeatContext = createContext<BeatContextType | undefined>(undefined);

export function BeatProvider({ children }: { children: React.ReactNode }) {
  const { selectedDistributor } = useDistributor();
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draftEntries, setDraftEntries] = useState<Record<string, DraftEntry>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountCollected, setAmountCollected] = useState(0);
  const [lastTransaction, setLastTransaction] = useState<CompletedTransaction | null>(null);
  const [completedTransactions, setCompletedTransactions] = useState<CompletedTransaction[]>([]);
  const [lastCompletedAt, setLastCompletedAt] = useState(0);

  const fetchMyBeat = async () => {
    if (!selectedDistributor) return;
    setIsLoading(true);
    try {
      const res = await api.get("/delivery/my-beat", { distributorId: selectedDistributor.id });
      if (res.success && res.data.assignment) {
        const mappedStores: Store[] = res.data.assignment.stores.map((item: any) => {
          const isDone = item.visit?.status === "completed";
          return {
            id: item.id.toString(),
            name: item.store.name,
            area: item.store.locality || "Unknown",
            phone: item.store.phone || "",
            outstanding: item.store.outstandingBalance || 0,
            daysOverdue: 0,
            status: isDone ? "clear" : (item.store.outstandingBalance > 5000 ? "critical" : "clear"),
            done: isDone,
            insights: [],
            visitId: item.visit?.id ? item.visit.id.toString() : null,
          };
        });
        setStores(mappedStores);
      } else {
        setStores([]);
      }
    } catch (err) {
      console.log(err);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDistributor) {
      setStores([]);
      setProducts([]);
      setCompletedTransactions([]);
      setLastCompletedAt(0);
      fetchMyBeat();
    } else {
      setStores([]);
      setProducts([]);
      setCompletedTransactions([]);
      setLastCompletedAt(0);
    }
  }, [selectedDistributor]);

  const getStore = (id: string) => stores.find((s) => s.id === id);

  const setDelivered = (productId: string, qty: number) => {
    setDraftEntries((prev) => ({
      ...prev,
      [productId]: { delivered: Math.max(0, qty), returned: prev[productId]?.returned ?? 0 },
    }));
  };

  const setReturned = (productId: string, qty: number) => {
    setDraftEntries((prev) => ({
      ...prev,
      [productId]: { delivered: prev[productId]?.delivered ?? 0, returned: Math.max(0, qty) },
    }));
  };

  const resetDraft = () => {
    setDraftEntries({});
    setPaymentMethod("cash");
    setAmountCollected(0);
  };

  const fetchProductsForVisit = async (visitId: string) => {
    if (!selectedDistributor) return;
    try {
      const res = await api.get(`/delivery/visits/${visitId}/products`, { distributorId: selectedDistributor.id });
      if (res.success) {
        setProducts(res.data.products.map((p: any) => ({
          id: p.id.toString(), name: p.name, code: p.code, unit: p.unit, price: p.price,
        })));
      }
    } catch (err) { console.log(err); }
  };

  const completeVisit = async (storeId: string): Promise<CompletedTransaction | null> => {
    if (!selectedDistributor) return null;
    const store = getStore(storeId);
    if (!store) return null;

    let visitId = store.visitId;
    try {
      if (!visitId) {
        const startRes = await api.post(`/delivery/visits/${storeId}/start`, { distributorId: selectedDistributor.id });
        if (!startRes.success) { Alert.alert("Error", startRes.message || "Failed to start visit."); return null; }
        visitId = startRes.data.visit.id.toString();
        store.visitId = visitId;
      }

      if (products.length === 0 && visitId) await fetchProductsForVisit(visitId);

      const deliveryPayload = Object.entries(draftEntries)
        .filter(([_, e]) => e.delivered > 0)
        .map(([skuId, e]) => ({ skuId: parseInt(skuId), quantity: e.delivered }));
      if (deliveryPayload.length > 0) {
        await api.post(`/delivery/visits/${visitId}/items`, { distributorId: selectedDistributor.id, body: { items: deliveryPayload } });
      }

      const returnPayload = Object.entries(draftEntries)
        .filter(([_, e]) => e.returned > 0)
        .map(([skuId, e]) => ({ skuId: parseInt(skuId), quantity: e.returned }));
      if (returnPayload.length > 0) {
        await api.post(`/delivery/visits/${visitId}/returns`, { distributorId: selectedDistributor.id, body: { items: returnPayload } });
      }

      if (amountCollected > 0) {
        if (paymentMethod === "credit") {
          const promisedDate = new Date();
          promisedDate.setDate(promisedDate.getDate() + 30);
          await api.post(`/delivery/visits/${visitId}/credit`, {
            distributorId: selectedDistributor.id,
            body: { amount: amountCollected, promisedDate: promisedDate.toISOString(), note: "Credit recorded at visit completion" },
          });
        } else {
          await api.post(`/delivery/visits/${visitId}/payment`, {
            distributorId: selectedDistributor.id,
            body: { amount: amountCollected, method: paymentMethod },
          });
        }
      }

      const completeRes = await api.post(`/delivery/visits/${visitId}/complete`, { distributorId: selectedDistributor.id });
      if (!completeRes.success) { Alert.alert("Error", completeRes.message || "Failed to complete visit."); return null; }

      await fetchMyBeat();
      setLastCompletedAt(Date.now());

      const collected = paymentMethod !== "credit" ? amountCollected : 0;
      const transaction: CompletedTransaction = {
        storeId, entries: draftEntries, paymentMethod, amountCollected,
        timestamp: new Date().toISOString(),
        outstandingAfter: Math.max(0, (store.outstanding ?? 0) - collected),
      };
      setLastTransaction(transaction);
      setCompletedTransactions((prev) => [...prev, transaction]);
      resetDraft();
      return transaction;
    } catch (err) {
      console.log("Error completing visit:", err);
      Alert.alert("Error", "A network error occurred while completing the visit.");
      return null;
    }
  };

  const getNextIncompleteStoreId = (excludeId: string) => {
    const next = stores.find((s) => s.id !== excludeId && !s.done);
    return next ? next.id : null;
  };

  return (
    <BeatContext.Provider value={{
      stores, products, isLoading, fetchMyBeat, getStore,
      draftEntries, setDelivered, setReturned,
      paymentMethod, setPaymentMethod,
      amountCollected, setAmountCollected,
      lastTransaction, completedTransactions, completeVisit, resetDraft,
      getNextIncompleteStoreId, lastCompletedAt,
    }}>
      {children}
    </BeatContext.Provider>
  );
}

export function useBeat() {
  const context = useContext(BeatContext);
  if (!context) throw new Error("useBeat must be used within BeatProvider");
  return context;
}
