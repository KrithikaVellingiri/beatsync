/*
  Warnings:

  - You are about to drop the `beat_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `beats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('green', 'yellow', 'red');

-- DropForeignKey
ALTER TABLE "beat_assignments" DROP CONSTRAINT "beat_assignments_beatId_fkey";

-- DropForeignKey
ALTER TABLE "beat_assignments" DROP CONSTRAINT "beat_assignments_deliveryBoyId_fkey";

-- DropForeignKey
ALTER TABLE "beat_assignments" DROP CONSTRAINT "beat_assignments_storeId_fkey";

-- DropForeignKey
ALTER TABLE "beats" DROP CONSTRAINT "beats_distributorId_fkey";

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "lastVisitedAt" TIMESTAMP(3),
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "outstandingBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "overdueDays" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "beat_assignments";

-- DropTable
DROP TABLE "beats";

-- CreateTable
CREATE TABLE "Beat" (
    "id" SERIAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "BeatStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeatAssignment" (
    "id" SERIAL NOT NULL,
    "beatId" INTEGER NOT NULL,
    "deliveryBoyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeatAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeatAssignmentStore" (
    "id" SERIAL NOT NULL,
    "beatAssignmentId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "visitOrder" INTEGER NOT NULL,
    "outstandingSnapshot" DECIMAL(10,2) NOT NULL,
    "overdueDaysSnapshot" INTEGER NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeatAssignmentStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedDeliveryItem" (
    "id" SERIAL NOT NULL,
    "beatAssignmentStoreId" INTEGER NOT NULL,
    "skuId" INTEGER NOT NULL,
    "plannedQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedDeliveryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Beat_distributorId_idx" ON "Beat"("distributorId");

-- CreateIndex
CREATE INDEX "Beat_date_idx" ON "Beat"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Beat_distributorId_date_key" ON "Beat"("distributorId", "date");

-- CreateIndex
CREATE INDEX "BeatAssignment_beatId_idx" ON "BeatAssignment"("beatId");

-- CreateIndex
CREATE INDEX "BeatAssignment_deliveryBoyId_idx" ON "BeatAssignment"("deliveryBoyId");

-- CreateIndex
CREATE UNIQUE INDEX "BeatAssignment_beatId_deliveryBoyId_key" ON "BeatAssignment"("beatId", "deliveryBoyId");

-- CreateIndex
CREATE INDEX "BeatAssignmentStore_beatAssignmentId_idx" ON "BeatAssignmentStore"("beatAssignmentId");

-- CreateIndex
CREATE INDEX "BeatAssignmentStore_storeId_idx" ON "BeatAssignmentStore"("storeId");

-- CreateIndex
CREATE INDEX "BeatAssignmentStore_visitOrder_idx" ON "BeatAssignmentStore"("visitOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BeatAssignmentStore_beatAssignmentId_storeId_key" ON "BeatAssignmentStore"("beatAssignmentId", "storeId");

-- CreateIndex
CREATE INDEX "PlannedDeliveryItem_beatAssignmentStoreId_idx" ON "PlannedDeliveryItem"("beatAssignmentStoreId");

-- CreateIndex
CREATE INDEX "PlannedDeliveryItem_skuId_idx" ON "PlannedDeliveryItem"("skuId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedDeliveryItem_beatAssignmentStoreId_skuId_key" ON "PlannedDeliveryItem"("beatAssignmentStoreId", "skuId");

-- AddForeignKey
ALTER TABLE "Beat" ADD CONSTRAINT "Beat_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatAssignment" ADD CONSTRAINT "BeatAssignment_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatAssignment" ADD CONSTRAINT "BeatAssignment_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatAssignmentStore" ADD CONSTRAINT "BeatAssignmentStore_beatAssignmentId_fkey" FOREIGN KEY ("beatAssignmentId") REFERENCES "BeatAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatAssignmentStore" ADD CONSTRAINT "BeatAssignmentStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedDeliveryItem" ADD CONSTRAINT "PlannedDeliveryItem_beatAssignmentStoreId_fkey" FOREIGN KEY ("beatAssignmentStoreId") REFERENCES "BeatAssignmentStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedDeliveryItem" ADD CONSTRAINT "PlannedDeliveryItem_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
