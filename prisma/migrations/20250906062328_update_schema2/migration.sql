/*
  Warnings:

  - A unique constraint covering the columns `[pilotId,eventId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Result_eventId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Result_pilotId_eventId_key" ON "public"."Result"("pilotId", "eventId");
