-- CreateTable
CREATE TABLE "public"."_SeasonPilots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeasonPilots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SeasonPilots_B_index" ON "public"."_SeasonPilots"("B");

-- AddForeignKey
ALTER TABLE "public"."_SeasonPilots" ADD CONSTRAINT "_SeasonPilots_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SeasonPilots" ADD CONSTRAINT "_SeasonPilots_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
