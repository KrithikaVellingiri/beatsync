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
  expectedCash: 8420,
  submittedCash: 8420,
  returns: 1250,
  discrepancy: 0,
  outstanding: 17100,
  progress: 73,
  status: "On Track",
  lastActive: "2026-08-19T10:10:00",
  dayClosed: false,
},

 {
  id: 2,
  name: "Suresh",
  area: "T. Nagar",
  stores: 9,
  completed: 8,
  total: 9,
  cash: 9100,
  expectedCash: 9100,
  submittedCash: 9100,
  returns: 1480,
  discrepancy: 0,
  outstanding: 19600,
  progress: 90,
  status: "On Track",
  lastActive: "2026-08-19T10:00:00",
  dayClosed: false,
},

  {
  id: 3,
  name: "Vikram",
  area: "Velachery",
  stores: 8,
  completed: 3,
  total: 8,
  cash: 4200,
  expectedCash: 5800,
  submittedCash: 4200,
  returns: 800,
  discrepancy: 1600,
  outstanding: 2100,
  progress: 37,
  status: "Attention",
  lastActive: "2026-08-19T08:30:00",
  dayClosed: false,
},
  {
  id: 4,
  name: "Arun",
  area: "Adyar",
  stores: 8,
  completed: 8,
  total: 8,
  cash: 11200,
  expectedCash: 11200,
  submittedCash: 11200,
  returns: 700,
  discrepancy: 0,
  outstanding: 4000,
  progress: 100,
  status: "Completed",
  lastActive: "2026-08-19T10:25:00",
  dayClosed: false,
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

    // Credit information
    overdue: 46,
    lastPayment: 600,
    lastPaymentDate: "24 Oct",

    // Beat planning information
    lastVisited: "2026-08-14",
    contact: "9876543210",
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

    lastVisited: "2026-08-15",
    contact: "9876543211",
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

    lastVisited: "2026-08-17",
    contact: "9876543212",
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

    lastVisited: "2026-08-16",
    contact: "9876543213",
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

    lastVisited: "2026-08-18",
    contact: "9876543214",
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

    lastVisited: "2026-08-16",
    contact: "9876543215",
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

    lastVisited: "2026-08-18",
    contact: "9876543216",
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

    lastVisited: "2026-08-15",
    contact: "9876543217",
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

    lastVisited: "2026-08-17",
    contact: "9876543218",
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

    lastVisited: "2026-08-18",
    contact: "9876543210",
  },
];

// ================================
// PREVIOUS DAY PENDING ITEMS
// ================================

export const previousDayPending = [
  {
    id: "PEN-001",
    storeId: "STR-001",
    storeName: "Ganesh Stores",
    locality: "Anna Nagar",
    outstanding: 14800,
    age: 46,
    status: "Critical",
  },

  {
    id: "PEN-002",
    storeId: "STR-002",
    storeName: "Sri Lakshmi Stores",
    locality: "T. Nagar",
    outstanding: 18400,
    age: 38,
    status: "Critical",
  },

  {
    id: "PEN-003",
    storeId: "STR-003",
    storeName: "Kumar Stores",
    locality: "Mogappair",
    outstanding: 2300,
    age: 12,
    status: "Watch",
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