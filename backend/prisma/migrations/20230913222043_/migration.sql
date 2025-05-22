-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "companyId" INT8;

-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "companyId" INT8;

-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "companyId" INT8;

-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "companyId" INT8;

-- AlterTable
ALTER TABLE "Indicator" ADD COLUMN     "companyId" INT8;

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "companyId" INT8;
