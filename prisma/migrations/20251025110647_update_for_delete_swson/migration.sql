-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_pilotId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "public"."Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
