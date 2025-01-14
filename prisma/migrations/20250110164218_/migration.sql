/*
  Warnings:

  - You are about to drop the column `image` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `closingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuisineType` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "image",
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "cuisineType" TEXT NOT NULL,
ADD COLUMN     "isDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "openDays" TEXT[],
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "taxNumber" TEXT;
