-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` CHAR(64) NOT NULL,
    `joindate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `hidelast` BOOLEAN NOT NULL DEFAULT false,
    `hidecss` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
