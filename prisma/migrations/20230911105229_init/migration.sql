/*
  Warnings:

  - You are about to drop the `emp_department` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dep_id` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `emp_department` DROP FOREIGN KEY `emp_department_dep_id_fkey`;

-- DropForeignKey
ALTER TABLE `emp_department` DROP FOREIGN KEY `emp_department_emp_id_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `dep_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `emp_department`;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_dep_id_fkey` FOREIGN KEY (`dep_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
