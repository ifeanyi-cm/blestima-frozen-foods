-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "businessName" TEXT NOT NULL DEFAULT 'Blestima Foods',
    "whatsappNumber" TEXT NOT NULL DEFAULT '2348104727853',
    "address" TEXT NOT NULL DEFAULT '',
    "deliveryFee" REAL NOT NULL DEFAULT 0,
    "logoUrl" TEXT,
    "bannerUrl" TEXT
);
