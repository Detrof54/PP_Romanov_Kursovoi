/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Penalty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Penalty" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
