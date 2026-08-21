// constants/mockStores.ts
export type Product = { id: string; name: string; unit: string };
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
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Good Day", unit: "Box" },
  { id: "p2", name: "Milk Bikis", unit: "Box" },
  { id: "p3", name: "Marie Gold", unit: "Box" },
];

export const INITIAL_STORES: Store[] = [
  {
    id: "1",
    name: "Ganesh Stores",
    area: "Anna Nagar",
    phone: "9876543210",
    outstanding: 14800,
    daysOverdue: 46,
    status: "critical",
    done: false,
    insights: [
      "Usually pays in 20–25 days",
      "Frequently returns Good Day",
      "Orders Marie Gold regularly",
    ],
  },
  {
    id: "2",
    name: "Kumar Stores",
    area: "Anna Nagar",
    phone: "9876543211",
    outstanding: 0,
    daysOverdue: 0,
    status: "clear",
    done: false,
    insights: ["Pays on delivery, mostly cash", "Low return history"],
  },
  {
    id: "3",
    name: "Anand Stores",
    area: "Kilpauk",
    phone: "9876543212",
    outstanding: 3200,
    daysOverdue: 12,
    status: "collectFirst",
    done: false,
    insights: ["Ask for partial collection before delivery", "Prefers UPI"],
  },
  {
    id: "4",
    name: "Sri Venkatesh Store",
    area: "Kilpauk",
    phone: "9876543213",
    outstanding: 1150,
    daysOverdue: 5,
    status: "clear",
    done: false,
    insights: ["Small, frequent orders", "Usually pays same week"],
  },
  {
    id: "5",
    name: "Lakshmi Traders",
    area: "Kilpauk",
    phone: "9876543214",
    outstanding: 0,
    daysOverdue: 0,
    status: "clear",
    done: false,
    insights: ["Reliable, no history of returns"],
  },
];