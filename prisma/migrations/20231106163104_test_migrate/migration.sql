/*
  Warnings:

  - You are about to alter the column `reason` on the `approval_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `written_place` on the `approval_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `backup_contact` on the `approval_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `attachment` on the `approval_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `status` on the `approval_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `dep_name` on the `department` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `first_name` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `last_name` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `gender` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `address` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `username` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `phone` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `status` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `holiday` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `type_name` on the `leave_type` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `clock_in` on the `time_record` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime(0)`.
  - You are about to alter the column `clock_out` on the `time_record` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime(0)`.
  - A unique constraint covering the columns `[username]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `approval_doc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `approval_doc` DROP FOREIGN KEY `approval_doc_dep_id_fkey`;

-- DropForeignKey
ALTER TABLE `approval_doc` DROP FOREIGN KEY `approval_doc_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `type_quantity` DROP FOREIGN KEY `type_quantity_type_id_fkey`;

-- AlterTable
ALTER TABLE `approval_doc` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `first_appr_at` DATETIME(0) NULL,
    ADD COLUMN `second_appr_at` DATETIME(0) NULL,
    ADD COLUMN `status_first_appr` VARCHAR(191) NULL,
    ADD COLUMN `status_second_appr` VARCHAR(191) NULL,
    MODIFY `dep_id` INTEGER NULL,
    MODIFY `type_id` INTEGER NULL,
    MODIFY `reason` VARCHAR(191) NOT NULL,
    MODIFY `written_place` VARCHAR(191) NOT NULL,
    MODIFY `backup_contact` VARCHAR(191) NOT NULL,
    MODIFY `attachment` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `department` MODIFY `dep_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `employee` MODIFY `first_name` VARCHAR(191) NOT NULL,
    MODIFY `last_name` VARCHAR(191) NOT NULL,
    MODIFY `birth_date` DATETIME(0) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `date_employed` DATETIME(0) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `holiday` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `start_date` DATETIME(0) NOT NULL,
    MODIFY `end_date` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `leave_type` MODIFY `type_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `time_record` MODIFY `date` DATETIME(0) NOT NULL,
    MODIFY `clock_in` DATETIME(0) NOT NULL,
    MODIFY `clock_out` DATETIME(0) NULL;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `noti_type` VARCHAR(191) NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `first_receiver` INTEGER NULL,
    `second_receiver` INTEGER NULL,
    `doc_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `is_seen_first` INTEGER NULL,
    `is_seen_second` INTEGER NULL,

    INDEX `notification_doc_id_fkey`(`doc_id`),
    INDEX `notification_first_receiver_fkey`(`first_receiver`),
    INDEX `notification_second_receiver_fkey`(`second_receiver`),
    INDEX `notification_sender_id_fkey`(`sender_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_hour` (
    `id` INTEGER NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `employee_username_key` ON `employee`(`username`);

-- AddForeignKey
ALTER TABLE `type_quantity` ADD CONSTRAINT `type_quantity_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `leave_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approval_doc` ADD CONSTRAINT `approval_doc_dep_id_fkey` FOREIGN KEY (`dep_id`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approval_doc` ADD CONSTRAINT `approval_doc_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `leave_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_doc_id_fkey` FOREIGN KEY (`doc_id`) REFERENCES `approval_doc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_first_receiver_fkey` FOREIGN KEY (`first_receiver`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_second_receiver_fkey` FOREIGN KEY (`second_receiver`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
