-- CreateTable
CREATE TABLE `Application` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `passportNumber` VARCHAR(255) NOT NULL,
    `proficientLanguages` TEXT NOT NULL,
    `hskLevel` VARCHAR(191) NOT NULL,
    `englishProficiency` VARCHAR(191) NOT NULL,
    `university` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `highestDegree` VARCHAR(191) NOT NULL,
    `currentAcademicYear` VARCHAR(191) NOT NULL,
    `graduationDate` DATETIME(3) NOT NULL,
    `postGraduationPlan` VARCHAR(191) NOT NULL,
    `intendedCity` VARCHAR(191) NOT NULL,
    `familyBusiness` TEXT NOT NULL,
    `expectedPosition` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Application_nationality_idx`(`nationality`),
    INDEX `Application_highestDegree_idx`(`highestDegree`),
    INDEX `Application_hskLevel_idx`(`hskLevel`),
    INDEX `Application_intendedCity_idx`(`intendedCity`),
    INDEX `Application_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` CHAR(36) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
