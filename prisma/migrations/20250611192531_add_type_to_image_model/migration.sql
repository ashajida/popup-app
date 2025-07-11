/*
  Warnings:

  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Media" ("createdAt", "id", "shop", "updatedAt") SELECT "createdAt", "id", "shop", "updatedAt" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
