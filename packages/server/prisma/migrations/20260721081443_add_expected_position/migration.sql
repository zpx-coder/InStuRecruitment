/*
  Warnings:

  - Added the required column `expectedPosition` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "proficientLanguages" TEXT NOT NULL,
    "hskLevel" TEXT NOT NULL,
    "englishProficiency" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "highestDegree" TEXT NOT NULL,
    "currentAcademicYear" TEXT NOT NULL,
    "graduationDate" DATETIME NOT NULL,
    "postGraduationPlan" TEXT NOT NULL,
    "intendedCity" TEXT NOT NULL,
    "familyBusiness" TEXT NOT NULL,
    "expectedPosition" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Application" ("birthday", "createdAt", "currentAcademicYear", "email", "englishProficiency", "expectedPosition", "familyBusiness", "gender", "graduationDate", "highestDegree", "hskLevel", "id", "intendedCity", "major", "name", "nationality", "notes", "passportNumber", "phone", "postGraduationPlan", "proficientLanguages", "university", "updatedAt") SELECT "birthday", "createdAt", "currentAcademicYear", "email", "englishProficiency", '', "familyBusiness", "gender", "graduationDate", "highestDegree", "hskLevel", "id", "intendedCity", "major", "name", "nationality", "notes", "passportNumber", "phone", "postGraduationPlan", "proficientLanguages", "university", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_nationality_idx" ON "Application"("nationality");
CREATE INDEX "Application_highestDegree_idx" ON "Application"("highestDegree");
CREATE INDEX "Application_hskLevel_idx" ON "Application"("hskLevel");
CREATE INDEX "Application_intendedCity_idx" ON "Application"("intendedCity");
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
