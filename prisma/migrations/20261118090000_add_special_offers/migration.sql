CREATE TABLE "SpecialOffer" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "message" TEXT,
  "bannerUrl" TEXT,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SpecialOffer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SpecialOfferItem" (
  "id" SERIAL NOT NULL,
  "specialOfferId" INTEGER NOT NULL,
  "productId" INTEGER NOT NULL,
  "offerPrice" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SpecialOfferItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SpecialOfferItem_specialOfferId_productId_key"
ON "SpecialOfferItem"("specialOfferId", "productId");

ALTER TABLE "SpecialOfferItem"
ADD CONSTRAINT "SpecialOfferItem_specialOfferId_fkey"
FOREIGN KEY ("specialOfferId") REFERENCES "SpecialOffer"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpecialOfferItem"
ADD CONSTRAINT "SpecialOfferItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
