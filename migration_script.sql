-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: bloodtesttracker2
-- Source Schemata: bloodtesttracker2
-- Created: Thu Jul 27 15:44:30 2023
-- Workbench Version: 8.0.33
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema bloodtesttracker2
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `bloodtesttracker2` ;
CREATE SCHEMA IF NOT EXISTS `bloodtesttracker2` ;

-- ----------------------------------------------------------------------------
-- Table bloodtesttracker2.custom_biomarkers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodtesttracker2`.`custom_biomarkers` (
  `user_id` VARCHAR(36) NOT NULL,
  `custom_biomarker_list` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table bloodtesttracker2.sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodtesttracker2`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `data` MEDIUMTEXT CHARACTER SET 'utf8mb4' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table bloodtesttracker2.user_documents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodtesttracker2`.`user_documents` (
  `document_id` VARCHAR(500) NOT NULL,
  `user_id` VARCHAR(120) NOT NULL,
  `document_name` VARCHAR(400) NOT NULL,
  `thumbnail_image_id` VARCHAR(200) NULL DEFAULT NULL,
  `date_added` BIGINT NOT NULL,
  PRIMARY KEY (`document_id`(255)))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table bloodtesttracker2.user_records
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodtesttracker2`.`user_records` (
  `id` VARCHAR(55) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `inTrash` TINYINT NOT NULL,
  `record_name` VARCHAR(200) NOT NULL,
  `date_edited` BIGINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table bloodtesttracker2.users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodtesttracker2`.`users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(120) NULL DEFAULT NULL,
  `email` VARCHAR(120) NULL DEFAULT NULL,
  `isGoogle` TINYINT NULL DEFAULT '0',
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NULL DEFAULT NULL,
  `age` TINYINT NULL DEFAULT NULL,
  `height_cm` DECIMAL(4,1) NULL DEFAULT NULL,
  `weight_kg` DECIMAL(5,2) NULL DEFAULT NULL,
  `profile_img` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 1;
