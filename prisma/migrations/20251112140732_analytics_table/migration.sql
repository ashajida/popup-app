/*
  Warnings:

  - The primary key for the `Analytics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Analytics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "popupId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventType" TEXT NOT NULL
);
INSERT INTO "new_Analytics" ("count", "createdAt", "eventType", "popupId", "productId", "shop", "updatedAt") SELECT "count", "createdAt", "eventType", "popupId", "productId", "shop", "updatedAt" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
CREATE UNIQUE INDEX "Analytics_shop_popupId_productId_eventType_createdAt_key" ON "Analytics"("shop", "popupId", "productId", "eventType", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
