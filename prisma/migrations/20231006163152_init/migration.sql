/*
  Warnings:

  - You are about to drop the column `quantity` on the `leave_type` table. All the data in the column will be lost.
  - You are about to drop the `day_off` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `leave_type` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `employee_dep_id_fkey`;

-- AlterTable
ALTER TABLE `employee` MODIFY `dep_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `leave_type` DROP COLUMN `quantity`,
    ADD COLUMN `fixed_quota` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `day_off`;

-- CreateTable
CREATE TABLE `dep_appr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dep_id` INTEGER NOT NULL,
    `first_appr` INTEGER NULL,
    `second_appr` INTEGER NULL,

    UNIQUE INDEX `dep_appr_dep_id_key`(`dep_id`),
    INDEX `dep_appr_first_appr_fkey`(`first_appr`),
    INDEX `dep_appr_second_appr_fkey`(`second_appr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_quantity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_id` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `type_quantity_type_id_fkey`(`type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holiday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `holiday_start_date_key`(`start_date`),
    UNIQUE INDEX `holiday_end_date_key`(`end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_dep_id_fkey` FOREIGN KEY (`dep_id`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dep_appr` ADD CONSTRAINT `dep_appr_dep_id_fkey` FOREIGN KEY (`dep_id`) REFERENCES `department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dep_appr` ADD CONSTRAINT `dep_appr_first_appr_fkey` FOREIGN KEY (`first_appr`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dep_appr` ADD CONSTRAINT `dep_appr_second_appr_fkey` FOREIGN KEY (`second_appr`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `type_quantity` ADD CONSTRAINT `type_quantity_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `leave_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
