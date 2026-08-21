-- Add payment verification metadata without changing unrelated models.
CREATE TYPE "PaymentStatus" AS ENUM ('captured', 'failed', 'refunded');

ALTER TABLE "Payment"
  ADD COLUMN "status" "PaymentStatus" NOT NULL DEFAULT 'captured',
  ADD COLUMN "razorpayOrderId" TEXT,
  ADD COLUMN "razorpayPaymentId" TEXT,
  ADD COLUMN "razorpaySignature" TEXT;

CREATE UNIQUE INDEX "Payment_razorpayOrderId_key"
  ON "Payment"("razorpayOrderId");

CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key"
  ON "Payment"("razorpayPaymentId");