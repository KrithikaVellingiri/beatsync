-- Add team codes to existing distributors before making the column required.
ALTER TABLE "distributors" ADD COLUMN "code" TEXT;

UPDATE "distributors"
SET "code" = UPPER(REGEXP_REPLACE(LEFT("name", 5), '[^A-Za-z0-9]', '', 'g')) || "id"::TEXT
WHERE "code" IS NULL;

ALTER TABLE "distributors" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "distributors_code_key" ON "distributors"("code");

ALTER TABLE "users" ALTER COLUMN "distributorId" DROP NOT NULL;

CREATE TYPE "DistributorMemberStatus" AS ENUM ('active', 'inactive');

CREATE TABLE "distributor_members" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "status" "DistributorMemberStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributor_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "distributor_members_userId_distributorId_key" ON "distributor_members"("userId", "distributorId");
CREATE INDEX "distributor_members_userId_idx" ON "distributor_members"("userId");
CREATE INDEX "distributor_members_distributorId_idx" ON "distributor_members"("distributorId");
CREATE INDEX "distributor_members_status_idx" ON "distributor_members"("status");

-- Preserve existing delivery-boy relationships in the new membership table.
INSERT INTO "distributor_members" ("userId", "distributorId", "status", "createdAt", "updatedAt")
SELECT "id", "distributorId", 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users"
WHERE "role" = 'delivery_boy' AND "distributorId" IS NOT NULL
ON CONFLICT ("userId", "distributorId") DO NOTHING;

ALTER TABLE "distributor_members" ADD CONSTRAINT "distributor_members_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "distributor_members" ADD CONSTRAINT "distributor_members_distributorId_fkey"
  FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE ON UPDATE CASCADE;