/*
  Warnings:

  - Added the required column `cnicBackPicture` to the `Beneficiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnicFrontPicture` to the `Beneficiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "cnicBackPicture" TEXT NOT NULL,
ADD COLUMN     "cnicFrontPicture" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "log" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
