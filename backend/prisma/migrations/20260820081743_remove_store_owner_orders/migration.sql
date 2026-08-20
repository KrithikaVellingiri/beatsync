/*
  Warnings:

  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_owners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_skuId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_storeId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_storeOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "store_owners" DROP CONSTRAINT "store_owners_storeId_fkey";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "store_owners";

-- DropEnum
DROP TYPE "OrderStatus";
