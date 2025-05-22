/*
  Warnings:

  - You are about to drop the column `content` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Indicator` table. All the data in the column will be lost.
  - Added the required column `dashboardData` to the `Dashboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equivalentFieldsData` to the `Indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formulaData` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "content";
ALTER TABLE "Dashboard" ADD COLUMN     "dashboardData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "companyId";
ALTER TABLE "Indicator" DROP COLUMN "value";
ALTER TABLE "Indicator" ADD COLUMN     "equivalentFieldsData" JSONB NOT NULL;
ALTER TABLE "Indicator" ADD COLUMN     "formulaData" JSONB NOT NULL;
