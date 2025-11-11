/*
  Warnings:

  - You are about to drop the column `name` on the `PopupStyle` table. All the data in the column will be lost.
  - Added the required column `name` to the `Popup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Popup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "mediaId" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaCursor" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft'
);
INSERT INTO "new_Popup" ("createdAt", "description", "id", "mediaCursor", "mediaId", "mediaType", "mediaUrl", "products", "shop", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "mediaCursor", "mediaId", "mediaType", "mediaUrl", "products", "shop", "status", "title", "updatedAt" FROM "Popup";
DROP TABLE "Popup";
ALTER TABLE "new_Popup" RENAME TO "Popup";
CREATE TABLE "new_PopupStyle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "popupId" TEXT NOT NULL,
    "titleColor" TEXT DEFAULT '#ffffff',
    "descriptionColor" TEXT DEFAULT '#ffffff',
    "backgroundColor" TEXT DEFAULT 'transparent',
    "buttonColor" TEXT,
    "textColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PopupStyle_popupId_fkey" FOREIGN KEY ("popupId") REFERENCES "Popup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PopupStyle" ("backgroundColor", "buttonColor", "createdAt", "descriptionColor", "id", "popupId", "textColor", "titleColor", "updatedAt") SELECT "backgroundColor", "buttonColor", "createdAt", "descriptionColor", "id", "popupId", "textColor", "titleColor", "updatedAt" FROM "PopupStyle";
DROP TABLE "PopupStyle";
ALTER TABLE "new_PopupStyle" RENAME TO "PopupStyle";
CREATE UNIQUE INDEX "PopupStyle_popupId_key" ON "PopupStyle"("popupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
