/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "sname" TEXT;

-- CreateTable
CREATE TABLE "GoodCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoodCategory_parentId_idx" ON "GoodCategory"("parentId");
