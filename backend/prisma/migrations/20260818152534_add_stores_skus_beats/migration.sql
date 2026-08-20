-- CreateEnum
CREATE TYPE "BeatStatus" AS ENUM ('draft', 'published', 'completed');

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ownerName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skus" (
    "id" SERIAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "unit" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beats" (
    "id" SERIAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "BeatStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beat_assignments" (
    "id" SERIAL NOT NULL,
    "beatId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "deliveryBoyId" INTEGER NOT NULL,
    "visitOrder" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beat_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stores_distributorId_idx" ON "stores"("distributorId");

-- CreateIndex
CREATE INDEX "stores_isActive_idx" ON "stores"("isActive");

-- CreateIndex
CREATE INDEX "skus_distributorId_idx" ON "skus"("distributorId");

-- CreateIndex
CREATE INDEX "skus_isActive_idx" ON "skus"("isActive");

-- CreateIndex
CREATE INDEX "beats_distributorId_idx" ON "beats"("distributorId");

-- CreateIndex
CREATE UNIQUE INDEX "beats_distributorId_date_key" ON "beats"("distributorId", "date");

-- CreateIndex
CREATE INDEX "beat_assignments_beatId_idx" ON "beat_assignments"("beatId");

-- CreateIndex
CREATE INDEX "beat_assignments_deliveryBoyId_idx" ON "beat_assignments"("deliveryBoyId");

-- CreateIndex
CREATE INDEX "beat_assignments_storeId_idx" ON "beat_assignments"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "beat_assignments_beatId_storeId_key" ON "beat_assignments"("beatId", "storeId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skus" ADD CONSTRAINT "skus_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beats" ADD CONSTRAINT "beats_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_assignments" ADD CONSTRAINT "beat_assignments_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "beats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_assignments" ADD CONSTRAINT "beat_assignments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_assignments" ADD CONSTRAINT "beat_assignments_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
