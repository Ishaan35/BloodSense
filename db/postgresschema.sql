CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR(36) PRIMARY KEY,
  "username" VARCHAR(45) NOT NULL,
  "password" VARCHAR(120),
  "email" VARCHAR(120),
  "isGoogle" SMALLINT DEFAULT 0,
  "first_name" VARCHAR(50) NOT NULL,
  "last_name" VARCHAR(50),
  "age" SMALLINT,
  "height_cm" NUMERIC(4,1),
  "weight_kg" NUMERIC(5,2),
  "profile_img" TEXT
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT EXISTS,
  PRIMARY KEY ("sid")
);

CREATE TABLE IF NOT EXISTS "user_records" (
    "id" VARCHAR(55) PRIMARY KEY,
    "user_id" VARCHAR(36) NOT NULL,
    "inTrash" SMALLINT NOT NULL,
    "record_name" VARCHAR(200) NOT NULL,
    "date_edited" BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_documents" (
  "document_id" VARCHAR(500) PRIMARY KEY,
  "user_id" VARCHAR(36) NOT NULL,
  "document_name" VARCHAR(400) NOT NULL,
  "thumbnail_image_id" VARCHAR(200),
  "date_added" BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS "custom_biomarkers" (
  "user_id" VARCHAR(36) PRIMARY KEY,
  "custom_biomarker_list" TEXT
);
