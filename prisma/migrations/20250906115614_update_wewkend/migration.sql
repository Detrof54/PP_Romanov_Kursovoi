-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "weekendId" TEXT NOT NULL DEFAULT 'event-1';

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_weekendId_fkey" FOREIGN KEY ("weekendId") REFERENCES "public"."Weekend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
