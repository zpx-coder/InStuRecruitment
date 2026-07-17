-- CreateTable
CREATE TABLE "Application" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Application_nationality_idx" ON "Application"("nationality");

-- CreateIndex
CREATE INDEX "Application_highestDegree_idx" ON "Application"("highestDegree");

-- CreateIndex
CREATE INDEX "Application_hskLevel_idx" ON "Application"("hskLevel");

-- CreateIndex
CREATE INDEX "Application_intendedCity_idx" ON "Application"("intendedCity");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
