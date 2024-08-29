/*
  Warnings:

  - You are about to drop the column `rfidId` on the `Patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_rfidId_fkey`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `rfidId`;

-- AlterTable
ALTER TABLE `RFID` ADD COLUMN `patientId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RFID` ADD CONSTRAINT `RFID_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
