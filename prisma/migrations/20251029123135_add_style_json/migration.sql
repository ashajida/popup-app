/*
  Warnings:

  - You are about to drop the `PopupStyle` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Popup" ADD COLUMN "style" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PopupStyle";
PRAGMA foreign_keys=on;
