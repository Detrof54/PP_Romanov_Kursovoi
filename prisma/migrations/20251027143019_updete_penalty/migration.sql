/*
  Warnings:

  - You are about to drop the column `disqualified` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Penalty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Penalty" DROP COLUMN "disqualified",
DROP COLUMN "points";
