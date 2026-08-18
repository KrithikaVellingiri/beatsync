// src/data/mockData.js

// ================================
// DELIVERY BOYS
// ================================

export const deliveryBoys = [
  {
    id: 1,
    name: "Raju",
    area: "Anna Nagar",
    stores: 10,
    completed: 7,
    total: 10,
    cash: 8420,
    returns: 1250,
    discrepancy: 0,
    progress: 73,
    status: "On Track",
  },

  {
    id: 2,
    name: "Suresh",
    area: "T. Nagar",
    stores: 9,
    completed: 8,
    total: 9,
    cash: 9100,
    returns: 1480,
    discrepancy: 0,
    progress: 90,
    status: "On Track",
  },

  {
    id: 3,
    name: "Vikram",
    area: "Velachery",
    stores: 8,
    completed: 3,
    total: 8,
    cash: 4200,
    returns: 800,
    discrepancy: 1600,
    progress: 37,
    status: "Attention",
  },

  {
    id: 4,
    name: "Arun",
    area: "Adyar",
    stores: 8,
    completed: 8,
    total: 8,
    cash: 11200,
    returns: 700,
    discrepancy: 0,
    progress: 100,
    status: "Completed",
  },
];


// ================================
// STORES
// ================================

export const stores = [
  {
    id: "STR-001",
    name: "Ganesh Stores",
    area: "Anna Nagar",
    locality: "Anna Nagar",
    boy: "Raju",
    boyId: 1,
    outstanding: 14800,
    outstandingAmount: 14800,
    priority: "High",
    status: "Critical",
    overdue: 46,
    lastPayment: 600,
    lastPaymentDate: "24 Oct",
  },

  {
    id: "STR-002",
    name: "Sri Lakshmi Stores",
    area: "T. Nagar",
    locality: "T. Nagar",
    boy: "Suresh",
    boyId: 2,
    outstanding: 18400,
    outstandingAmount: 18400,
    priority: "High",
    status: "Critical",
    overdue: 38,
    lastPayment: 1500,
    lastPaymentDate: "23 Oct",
  },

  {
    id: "STR-003",
    name: "Kumar Stores",
    area: "Mogappair",
    locality: "Mogappair",
    boy: "Raju",
    boyId: 1,
    outstanding: 2300,
    outstandingAmount: 2300,
    priority: "Medium",
    status: "Watch",
    overdue: 12,
    lastPayment: 1200,
    lastPaymentDate: "24 Oct",
  },

  {
    id: "STR-004",
    name: "Vijay Stores",
    area: "Nolambur",
    locality: "Nolambur",
    boy: "Suresh",
    boyId: 2,
    outstanding: 1200,
    outstandingAmount: 1200,
    priority: "Medium",
    status: "Watch",
    overdue: 8,
    lastPayment: 500,
    lastPaymentDate: "22 Oct",
  },

  {
    id: "STR-005",
    name: "Siva Stores",
    area: "Vadapalani",
    locality: "Vadapalani",
    boy: "Vikram",
    boyId: 3,
    outstanding: 900,
    outstandingAmount: 900,
    priority: "Low",
    status: "Healthy",
    overdue: 2,
    lastPayment: 300,
    lastPaymentDate: "24 Oct",
  },

  {
    id: "STR-006",
    name: "Super Mart",
    area: "T. Nagar",
    locality: "T. Nagar",
    boy: "Raju",
    boyId: 1,
    outstanding: 1800,
    outstandingAmount: 1800,
    priority: "Medium",
    status: "Watch",
    overdue: 5,
    lastPayment: 800,
    lastPaymentDate: "20 Oct",
  },

  {
    id: "STR-007",
    name: "Anbu Stores",
    area: "Adyar",
    locality: "Adyar",
    boy: "Arun",
    boyId: 4,
    outstanding: 800,
    outstandingAmount: 800,
    priority: "Low",
    status: "Healthy",
    overdue: 0,
    lastPayment: 2400,
    lastPaymentDate: "24 Oct",
  },

  {
    id: "STR-008",
    name: "Daily Needs",
    area: "Adyar",
    locality: "Adyar",
    boy: "Arun",
    boyId: 4,
    outstanding: 3200,
    outstandingAmount: 3200,
    priority: "Medium",
    status: "Watch",
    overdue: 7,
    lastPayment: 1000,
    lastPaymentDate: "21 Oct",
  },

  {
    id: "STR-009",
    name: "Lucky Stores",
    area: "Velachery",
    locality: "Velachery",
    boy: "Vikram",
    boyId: 3,
    outstanding: 600,
    outstandingAmount: 600,
    priority: "Low",
    status: "Healthy",
    overdue: 4,
    lastPayment: 600,
    lastPaymentDate: "23 Oct",
  },

  {
    id: "STR-010",
    name: "GR Stores",
    area: "Velachery",
    locality: "Velachery",
    boy: "Vikram",
    boyId: 3,
    outstanding: 600,
    outstandingAmount: 600,
    priority: "Low",
    status: "Healthy",
    overdue: 1,
    lastPayment: 400,
    lastPaymentDate: "24 Oct",
  },
];


// ================================
// BEAT GENERATOR
// ================================

export const beatStores = stores;


// ================================
// COLLECTION TREND
// ================================

export const collectionTrend = [
  {
    day: "Mon",
    amount: 28400,
  },
  {
    day: "Tue",
    amount: 31200,
  },
  {
    day: "Wed",
    amount: 29800,
  },
  {
    day: "Thu",
    amount: 32600,
  },
  {
    day: "Fri",
    amount: 30100,
  },
  {
    day: "Sat",
    amount: 34200,
  },
  {
    day: "Today",
    amount: 32600,
  },
];


// ================================
// DASHBOARD METRICS
// ================================

export const dashboardMetrics = {
  totalStores: 143,
  completedStores: 22,
  cashCollected: 32600,
  returns: 14,
  attentionNeeded: 2,

  expectedCash: 32600,
  submittedCash: 30600,
  discrepancy: 2000,
};


// ================================
// RECONCILIATION
// ================================

export const reconciliation = {
  expectedCash: 32600,
  submittedCash: 30600,
  difference: 2000,
};


// ================================
// STORE LEDGER
// ================================

export const storeLedger = stores;

stores.forEach((store) => {
  store.intelligence = [
    `Usually pays within ${store.overdue > 30 ? "30–45" : "30"} days`,
    "Regular FMCG customer",
    store.outstanding > 10000
      ? "Outstanding amount requires attention"
      : "Outstanding amount is within normal range",
  ];

  store.transactions = [
    [
      store.lastPaymentDate,
      "Payment",
      `₹${store.lastPayment.toLocaleString("en-IN")}`,
      "Cash payment received",
    ],
    [
      "23 Oct",
      "Delivery",
      "₹3,200",
      "Regular store delivery",
    ],
    [
      "18 Oct",
      "Credit",
      "₹2,500",
      "Credit sale",
    ],
  ];
});