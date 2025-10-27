/*
  Warnings:

  - You are about to drop the column `points` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Result" DROP COLUMN "points",
DROP COLUMN "position",
ADD COLUMN     "totalTime" INTEGER NOT NULL DEFAULT 0;
