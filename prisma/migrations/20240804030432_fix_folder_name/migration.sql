/*
  Warnings:

  - You are about to drop the column `link` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Folder_link_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "link",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_key" ON "Folder"("name");
