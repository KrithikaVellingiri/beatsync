const test = require("node:test");
const assert = require("node:assert/strict");

const { calculateVisitAmounts } = require("../src/utils/ledger");

test("calculateVisitAmounts counts only captured payments", () => {
  const amounts = calculateVisitAmounts({
    deliveryItems: [
      { quantity: 10, sku: { price: 10 } },
    ],
    returnItems: [
      { quantity: 2, sku: { price: 10 } },
    ],
    payments: [
      { amount: 30, status: "captured" },
      { amount: 20, status: "failed" },
      { amount: 10, status: "refunded" },
    ],
    creditPromise: {
      amount: 20,
    },
  });

  assert.equal(amounts.salesAmount, 100);
  assert.equal(amounts.returnAmount, 20);
  assert.equal(amounts.netSales, 80);
  assert.equal(amounts.creditAmount, 20);
  assert.equal(amounts.paymentAmount, 30);
  assert.equal(amounts.expectedCollection, 60);
  assert.equal(amounts.discrepancy, 30);
});
