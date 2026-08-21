function calculateVisitAmounts(visit) {
  let salesAmount = 0;
  let returnAmount = 0;
  let paymentAmount = 0;
  let creditAmount = 0;

  for (const item of visit.deliveryItems || []) {
    salesAmount += Number(item.quantity) * Number(item.sku.price);
  }

  for (const item of visit.returnItems || []) {
    returnAmount += Number(item.quantity) * Number(item.sku.price);
  }

  for (const payment of visit.payments || []) {
    if (payment.status === "captured") {
      paymentAmount += Number(payment.amount);
    }
  }

  if (visit.creditPromise) {
    creditAmount = Number(visit.creditPromise.amount);
  }

  const netSales = salesAmount - returnAmount;

  /*
   * Amount that should have been settled today:
   *
   * Net sales - amount promised as credit
   */
  const expectedCollection = Math.max(
    0,
    netSales - creditAmount
  );

  const discrepancy =
    expectedCollection - paymentAmount;

  return {
    salesAmount: Number(salesAmount.toFixed(2)),
    returnAmount: Number(returnAmount.toFixed(2)),
    paymentAmount: Number(paymentAmount.toFixed(2)),
    creditAmount: Number(creditAmount.toFixed(2)),
    netSales: Number(netSales.toFixed(2)),
    expectedCollection: Number(
      expectedCollection.toFixed(2)
    ),
    discrepancy: Number(discrepancy.toFixed(2)),
  };
}

module.exports = {
  calculateVisitAmounts,
};