-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT[],
    "fileKey" TEXT NOT NULL,
    "publication" INTEGER NOT NULL,
    "publicDomain" BOOLEAN NOT NULL,
    "copyrightReferencesRemoved" BOOLEAN NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
