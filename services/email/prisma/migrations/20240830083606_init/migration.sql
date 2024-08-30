/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginHistory" DROP CONSTRAINT "LoginHistory_authId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_authUserId_fkey";

-- DropTable
DROP TABLE "Auth";

-- DropTable
DROP TABLE "LoginHistory";

-- DropTable
DROP TABLE "VerificationCode";

-- DropEnum
DROP TYPE "LoginAttempt";

-- DropEnum
DROP TYPE "ROLE";

-- DropEnum
DROP TYPE "STATUS";

-- DropEnum
DROP TYPE "VErificationStatus";

-- DropEnum
DROP TYPE "VerificationCodeType";

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
