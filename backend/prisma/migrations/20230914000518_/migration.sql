/*
  Warnings:

  - Added the required column `accumulationType` to the `Indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graph` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Indicator" ADD COLUMN     "accumulationType" STRING NOT NULL;
ALTER TABLE "Indicator" ADD COLUMN     "graph" STRING NOT NULL;
