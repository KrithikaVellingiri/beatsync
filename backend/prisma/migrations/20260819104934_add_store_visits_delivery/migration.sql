-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('pending', 'in_progress', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'upi');

-- CreateEnum
CREATE TYPE "CreditPromiseStatus" AS ENUM ('pending', 'fulfilled', 'overdue');

-- CreateTable
CREATE TABLE "StoreVisit" (
    "id" SERIAL NOT NULL,
    "beatAssignmentStoreId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "deliveryBoyId" INTEGER NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryItem" (
    "id" SERIAL NOT NULL,
    "storeVisitId" INTEGER NOT NULL,
    "skuId" INTEGER NOT NULL,
    "plannedDeliveryItemId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnItem" (
    "id" SERIAL NOT NULL,
    "storeVisitId" INTEGER NOT NULL,
    "skuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "storeVisitId" INTEGER NOT NULL,
    "deliveryBoyId" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPromise" (
    "id" SERIAL NOT NULL,
    "storeVisitId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "promisedDate" TIMESTAMP(3) NOT NULL,
    "status" "CreditPromiseStatus" NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditPromise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreVisit_storeId_idx" ON "StoreVisit"("storeId");

-- CreateIndex
CREATE INDEX "StoreVisit_deliveryBoyId_idx" ON "StoreVisit"("deliveryBoyId");

-- CreateIndex
CREATE INDEX "StoreVisit_status_idx" ON "StoreVisit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StoreVisit_beatAssignmentStoreId_key" ON "StoreVisit"("beatAssignmentStoreId");

-- CreateIndex
CREATE INDEX "DeliveryItem_storeVisitId_idx" ON "DeliveryItem"("storeVisitId");

-- CreateIndex
CREATE INDEX "DeliveryItem_skuId_idx" ON "DeliveryItem"("skuId");

-- CreateIndex
CREATE INDEX "DeliveryItem_plannedDeliveryItemId_idx" ON "DeliveryItem"("plannedDeliveryItemId");

-- CreateIndex
CREATE INDEX "ReturnItem_storeVisitId_idx" ON "ReturnItem"("storeVisitId");

-- CreateIndex
CREATE INDEX "ReturnItem_skuId_idx" ON "ReturnItem"("skuId");

-- CreateIndex
CREATE INDEX "Payment_storeVisitId_idx" ON "Payment"("storeVisitId");

-- CreateIndex
CREATE INDEX "Payment_deliveryBoyId_idx" ON "Payment"("deliveryBoyId");

-- CreateIndex
CREATE INDEX "Payment_method_idx" ON "Payment"("method");

-- CreateIndex
CREATE UNIQUE INDEX "CreditPromise_storeVisitId_key" ON "CreditPromise"("storeVisitId");

-- AddForeignKey
ALTER TABLE "StoreVisit" ADD CONSTRAINT "StoreVisit_beatAssignmentStoreId_fkey" FOREIGN KEY ("beatAssignmentStoreId") REFERENCES "BeatAssignmentStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreVisit" ADD CONSTRAINT "StoreVisit_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreVisit" ADD CONSTRAINT "StoreVisit_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryItem" ADD CONSTRAINT "DeliveryItem_storeVisitId_fkey" FOREIGN KEY ("storeVisitId") REFERENCES "StoreVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryItem" ADD CONSTRAINT "DeliveryItem_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryItem" ADD CONSTRAINT "DeliveryItem_plannedDeliveryItemId_fkey" FOREIGN KEY ("plannedDeliveryItemId") REFERENCES "PlannedDeliveryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_storeVisitId_fkey" FOREIGN KEY ("storeVisitId") REFERENCES "StoreVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_storeVisitId_fkey" FOREIGN KEY ("storeVisitId") REFERENCES "StoreVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditPromise" ADD CONSTRAINT "CreditPromise_storeVisitId_fkey" FOREIGN KEY ("storeVisitId") REFERENCES "StoreVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
