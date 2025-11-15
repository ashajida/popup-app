/*
  Warnings:

  - Added the required column `date` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "popupId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventType" TEXT NOT NULL
);
INSERT INTO "new_Analytics" ("count", "createdAt", "eventType", "popupId", "productId", "shop", "updatedAt") SELECT "count", "createdAt", "eventType", "popupId", "productId", "shop", "updatedAt" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
CREATE UNIQUE INDEX "Analytics_shop_popupId_productId_eventType_date_key" ON "Analytics"("shop", "popupId", "productId", "eventType", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
