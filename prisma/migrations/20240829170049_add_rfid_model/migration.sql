/*
  Warnings:

  - A unique constraint covering the columns `[rfidId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `rfidId` INTEGER NULL;

-- CreateTable
CREATE TABLE `RFID` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RFID_tag_key`(`tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_rfidId_key` ON `Patient`(`rfidId`);

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_rfidId_fkey` FOREIGN KEY (`rfidId`) REFERENCES `RFID`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
