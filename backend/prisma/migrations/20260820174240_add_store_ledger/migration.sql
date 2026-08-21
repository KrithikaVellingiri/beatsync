-- CreateTable
CREATE TABLE "store_ledger_entries" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "storeVisitId" INTEGER,
    "previousBalance" DECIMAL(10,2) NOT NULL,
    "salesAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "returnAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paymentAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "newBalance" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_ledger_entries_storeVisitId_key" ON "store_ledger_entries"("storeVisitId");

-- CreateIndex
CREATE INDEX "store_ledger_entries_storeId_idx" ON "store_ledger_entries"("storeId");

-- CreateIndex
CREATE INDEX "store_ledger_entries_storeVisitId_idx" ON "store_ledger_entries"("storeVisitId");

-- CreateIndex
CREATE INDEX "store_ledger_entries_createdAt_idx" ON "store_ledger_entries"("createdAt");

-- AddForeignKey
ALTER TABLE "store_ledger_entries" ADD CONSTRAINT "store_ledger_entries_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_ledger_entries" ADD CONSTRAINT "store_ledger_entries_storeVisitId_fkey" FOREIGN KEY ("storeVisitId") REFERENCES "StoreVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
