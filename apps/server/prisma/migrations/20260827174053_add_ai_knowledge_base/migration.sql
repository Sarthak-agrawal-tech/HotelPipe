-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "amenities" TEXT,
ADD COLUMN     "banquetPackages" TEXT,
ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "faqs" TEXT,
ADD COLUMN     "googleMapsLink" TEXT,
ADD COLUMN     "roomCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "roomTypesAndPricing" TEXT,
ADD COLUMN     "secondaryNumbers" TEXT,
ADD COLUMN     "teamSize" TEXT NOT NULL DEFAULT 'solo';

-- CreateTable
CREATE TABLE "HotelMedia" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotelMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HotelMedia" ADD CONSTRAINT "HotelMedia_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
