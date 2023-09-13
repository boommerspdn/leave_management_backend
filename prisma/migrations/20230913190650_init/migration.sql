/*
  Warnings:

  - You are about to drop the column `date` on the `day_off` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `employee` table. All the data in the column will be lost.
  - You are about to alter the column `total_hours` on the `time_record` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal(4,2)`.
  - A unique constraint covering the columns `[start_date]` on the table `day_off` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[end_date]` on the table `day_off` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `start_date` to the `day_off` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_employed` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `day_off` DROP COLUMN `date`,
    ADD COLUMN `end_date` DATE NULL,
    ADD COLUMN `start_date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `age`,
    ADD COLUMN `date_employed` DATE NOT NULL,
    ADD COLUMN `phone` VARCHAR(255) NOT NULL,
    ADD COLUMN `status` VARCHAR(255) NOT NULL,
    MODIFY `birth_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `time_record` MODIFY `clock_out` TIME(0) NULL,
    MODIFY `total_hours` DECIMAL(4, 2) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `day_off_start_date_key` ON `day_off`(`start_date`);

-- CreateIndex
CREATE UNIQUE INDEX `day_off_end_date_key` ON `day_off`(`end_date`);
