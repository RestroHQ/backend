/*
  Warnings:

  - You are about to drop the `OrderPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderPayment" DROP CONSTRAINT "OrderPayment_orderId_fkey";

-- DropTable
DROP TABLE "OrderPayment";
