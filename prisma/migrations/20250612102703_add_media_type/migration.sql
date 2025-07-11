/*
  Warnings:

  - You are about to drop the column `media` on the `Popup` table. All the data in the column will be lost.
  - Added the required column `mediaType` to the `Popup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaUrl` to the `Popup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Popup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Popup" ("createdAt", "description", "id", "products", "shop", "title", "updatedAt") SELECT "createdAt", "description", "id", "products", "shop", "title", "updatedAt" FROM "Popup";
DROP TABLE "Popup";
ALTER TABLE "new_Popup" RENAME TO "Popup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
