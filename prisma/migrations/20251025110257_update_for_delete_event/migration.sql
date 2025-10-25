/*
  Warnings:

  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_weekendId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Penalty" DROP CONSTRAINT "Penalty_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Weekend" DROP CONSTRAINT "Weekend_seasonId_fkey";

-- DropTable
DROP TABLE "public"."News";

-- AddForeignKey
ALTER TABLE "public"."Weekend" ADD CONSTRAINT "Weekend_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_weekendId_fkey" FOREIGN KEY ("weekendId") REFERENCES "public"."Weekend"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
