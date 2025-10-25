-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image" BYTEA,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
