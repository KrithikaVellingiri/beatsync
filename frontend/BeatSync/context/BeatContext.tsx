import React, { createContext, useContext, useState } from "react";

import {
  INITIAL_STORES,
  PRODUCTS,
  Product,
  Store,
} from "../constants/mockStores";

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

type BeatContextType = {
  stores: Store[];
  products: Product[];

  getStore: (id: string) => Store | undefined;

  draftEntries: Record<string, DraftEntry>;

  setDelivered: (
    productId: string,
    qty: number
  ) => void;

  setReturned: (
    productId: string,
    qty: number
  ) => void;

  paymentMethod: PaymentMethod;

  setPaymentMethod: (
    method: PaymentMethod
  ) => void;

  amountCollected: number;

  setAmountCollected: (
    amount: number
  ) => void;

  lastTransaction: CompletedTransaction | null;

  completedTransactions: CompletedTransaction[];

  completeVisit: (
    storeId: string
  ) => CompletedTransaction;

  resetDraft: () => void;

  getNextIncompleteStoreId: (
    excludeId: string
  ) => string | null;
};

const BeatContext =
  createContext<BeatContextType | undefined>(
    undefined
  );

export function BeatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stores, setStores] =
    useState<Store[]>(INITIAL_STORES);

  const [draftEntries, setDraftEntries] =
    useState<Record<string, DraftEntry>>({});

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [amountCollected, setAmountCollected] =
    useState(0);

  const [
    lastTransaction,
    setLastTransaction,
  ] = useState<CompletedTransaction | null>(
    null
  );

  const [
    completedTransactions,
    setCompletedTransactions,
  ] = useState<CompletedTransaction[]>([]);

  const getStore = (id: string) => {
    return stores.find(
      (store) => store.id === id
    );
  };

  const setDelivered = (
    productId: string,
    qty: number
  ) => {
    setDraftEntries((previous) => ({
      ...previous,

      [productId]: {
        delivered: Math.max(0, qty),

        returned:
          previous[productId]?.returned ?? 0,
      },
    }));
  };

  const setReturned = (
    productId: string,
    qty: number
  ) => {
    setDraftEntries((previous) => ({
      ...previous,

      [productId]: {
        delivered:
          previous[productId]?.delivered ?? 0,

        returned: Math.max(0, qty),
      },
    }));
  };

  const resetDraft = () => {
    setDraftEntries({});

    setPaymentMethod("cash");

    setAmountCollected(0);
  };

  const completeVisit = (
    storeId: string
  ): CompletedTransaction => {
    const store = getStore(storeId);

    const outstandingAfter = Math.max(
      0,
      (store?.outstanding ?? 0) -
        amountCollected
    );

    const transaction: CompletedTransaction = {
      storeId,

      entries: draftEntries,

      paymentMethod,

      amountCollected,

      timestamp: new Date().toISOString(),

      outstandingAfter,
    };

    setStores((previous) =>
      previous.map((storeItem) =>
        storeItem.id === storeId
          ? {
              ...storeItem,

              done: true,

              outstanding:
                outstandingAfter,

              status: "clear",
            }
          : storeItem
      )
    );

    setLastTransaction(transaction);

    setCompletedTransactions(
      (previous) => [
        ...previous,
        transaction,
      ]
    );

    resetDraft();

    return transaction;
  };

  const getNextIncompleteStoreId = (
    excludeId: string
  ) => {
    const nextStore = stores.find(
      (store) =>
        store.id !== excludeId &&
        !store.done
    );

    return nextStore
      ? nextStore.id
      : null;
  };

  return (
    <BeatContext.Provider
      value={{
        stores,

        products: PRODUCTS,

        getStore,

        draftEntries,

        setDelivered,

        setReturned,

        paymentMethod,

        setPaymentMethod,

        amountCollected,

        setAmountCollected,

        lastTransaction,

        completedTransactions,

        completeVisit,

        resetDraft,

        getNextIncompleteStoreId,
      }}
    >
      {children}
    </BeatContext.Provider>
  );
}

export function useBeat() {
  const context = useContext(BeatContext);

  if (!context) {
    throw new Error(
      "useBeat must be used within BeatProvider"
    );
  }

  return context;
}