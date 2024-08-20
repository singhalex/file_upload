/*
  Warnings:

  - Added the required column `date` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
