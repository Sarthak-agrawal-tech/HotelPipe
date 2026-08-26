/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_ownerId_key" ON "Hotel"("ownerId");
