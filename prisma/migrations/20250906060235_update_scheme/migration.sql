/*
  Warnings:

  - A unique constraint covering the columns `[seasonId,stage]` on the table `Weekend` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Result_pilotId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Weekend_seasonId_stage_key" ON "public"."Weekend"("seasonId", "stage");
