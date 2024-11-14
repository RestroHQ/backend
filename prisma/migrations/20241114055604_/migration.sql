/*
  Warnings:

  - Added the required column `closingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuisineType` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "cuisineType" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openDays" TEXT[],
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "taxNumber" TEXT;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT;
