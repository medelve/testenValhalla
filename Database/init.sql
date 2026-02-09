-- ============================================================
-- SQL Valhalla - Kapitel 1 (MariaDB kompatibel)
-- Theme: Wikinger / Dorfverwaltung
-- ============================================================

DROP DATABASE IF EXISTS dorfsystem;
CREATE DATABASE dorfsystem;
USE dorfsystem;

-- 1) Dorfbewohner
CREATE TABLE dorfbewohner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  geschlecht ENUM('M','W','X') DEFAULT 'X',
  im_dorf TINYINT(1) NOT NULL DEFAULT 1,
  arbeit VARCHAR(100) NULL,              -- NULL = keine Arbeit
  in_ausbildung TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- 2) Ställe
CREATE TABLE stall (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  weizen_kg INT NOT NULL DEFAULT 0,
  bearbeiter_id INT NULL,
  CONSTRAINT fk_stall_bearbeiter
    FOREIGN KEY (bearbeiter_id) REFERENCES dorfbewohner(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3) Schmied
CREATE TABLE schmied (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  eisen INT NOT NULL DEFAULT 0,
  kohle INT NOT NULL DEFAULT 0,
  holz  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- 4) Wachen
CREATE TABLE wache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eingang ENUM('Nord Eingang','West Eingang') NOT NULL UNIQUE,
  wachposten_id INT NULL,
  CONSTRAINT fk_wache_posten
    FOREIGN KEY (wachposten_id) REFERENCES dorfbewohner(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5) Dörfer
CREATE TABLE doerfer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  anzahl_bewohner INT NOT NULL,
  entfernung_km INT NOT NULL,
  anfuehrer VARCHAR(100) NOT NULL,
  freundlich TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ============================================================
-- Testdaten: Dorfbewohner
-- ============================================================

INSERT INTO dorfbewohner (name, age, geschlecht, im_dorf, arbeit, in_ausbildung) VALUES
('Eirik', 42, 'M', 1,  'Dorfvorsteher', 0),
('Sigrid', 38, 'W', 1,  'Heilerin', 0),
('Grondolf', 51, 'M', 1,  'Schmied', 0),

('Bjorn', 33, 'M', 1,  'Bauer', 0),
('Astrid', 27, 'W', 1,  'Bäckerin', 0),
('Leif', 22, 'M', 1,  'Holzfäller', 0),
('Runa', 31, 'W', 1,  'Fischerin', 0),
('Hakon', 29, 'M', 1,  'Jäger', 0),
('Freya', 24, 'W', 1,  'Weberin', 0),
('Torsten', 36, 'M', 1,  'Bauer', 0),
('Inga', 19, 'W', 1,  'Kräutersammlerin', 0),
('Ulf', 26, 'M', 1,  'Bauer', 0),

('Ragnar', 30, 'M', 1,  'Wache', 0),
('Ivar', 25, 'M', 1,  'Wache', 0),

('Bodil', 21, 'W', 1,  NULL, 0),
('Asmund', 20, 'M', 1,  NULL, 0),
('Eydis', 29, 'W', 1,  NULL, 0),

('Sven', 34, 'M', 0, 'Jäger', 0),
('Kara', 22, 'W', 0, 'Händlerin', 0),

('Einar', 15, 'M', 1, NULL, 1),
('Thyra', 14, 'W', 1, NULL, 1),
('Sigurd', 16, 'M', 1, 'Lehrling Schmied', 1),
('Alva', 16, 'W', 1, 'Lehrling Heilerin', 1);

-- ============================================================
-- Testdaten: Ställe
-- (IDs: Bjorn=4, Torsten=10, Ulf=12)
-- ============================================================

INSERT INTO stall (name, weizen_kg, bearbeiter_id) VALUES
('Mayhren', 78, 4),
('Kohplan', 34, NULL),
('Hjalmund Stall', 120, 10),
('Rabenstall', 55, 12),
('Frosthuf Stall', 15, NULL);

-- ============================================================
-- Testdaten: Schmied
-- ============================================================

INSERT INTO schmied (name, eisen, kohle, holz) VALUES
('Grondolf', 18, 7, 31);

-- ============================================================
-- Testdaten: Wachen
-- (Ragnar=13)
-- ============================================================

INSERT INTO wache (eingang, wachposten_id) VALUES
('Nord Eingang', 13),
('West Eingang', NULL);

-- ============================================================
-- Testdaten: Dörfer
-- ============================================================

INSERT INTO doerfer (name, anzahl_bewohner, entfernung_km, anfuehrer, freundlich) VALUES
('Hrafnvik', 850, 45, 'Jarl Skuli', 0),
('Eichenfeld', 1400, 30, 'Jarl Signe', 1),
('Nebelfurt', 420, 22, 'Jarl Hroald', 0),
('Wolfsheim', 980, 50, 'Jarl Einar', 0),
('Schildwacht', 1600, 15, 'Jarl Rurik', 1),
('Dunkelwald', 520, 48, 'Jarl Asgeir', 0);