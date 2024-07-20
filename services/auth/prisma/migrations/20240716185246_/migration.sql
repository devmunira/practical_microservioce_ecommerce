/*
  Warnings:

  - The values [SUSPENDE] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPEND', 'PENDING');
ALTER TABLE "Auth" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Auth" ALTER COLUMN "status" TYPE "STATUS_new" USING ("status"::text::"STATUS_new");
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
ALTER TABLE "Auth" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
