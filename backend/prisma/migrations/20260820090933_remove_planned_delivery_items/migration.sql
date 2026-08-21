/*
  Warnings:

  - You are about to drop the column `plannedDeliveryItemId` on the `DeliveryItem` table. All the data in the column will be lost.
  - You are about to drop the `PlannedDeliveryItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeliveryItem" DROP CONSTRAINT "DeliveryItem_plannedDeliveryItemId_fkey";

-- DropForeignKey
ALTER TABLE "PlannedDeliveryItem" DROP CONSTRAINT "PlannedDeliveryItem_beatAssignmentStoreId_fkey";

-- DropForeignKey
ALTER TABLE "PlannedDeliveryItem" DROP CONSTRAINT "PlannedDeliveryItem_skuId_fkey";

-- DropIndex
DROP INDEX "DeliveryItem_plannedDeliveryItemId_idx";

-- AlterTable
ALTER TABLE "DeliveryItem" DROP COLUMN "plannedDeliveryItemId";

-- DropTable
DROP TABLE "PlannedDeliveryItem";
