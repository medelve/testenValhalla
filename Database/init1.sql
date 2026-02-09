DROP DATABASE IF EXISTS dorfsystem;
CREATE DATABASE dorfsystem;
USE dorfsystem;

CREATE TABLE Dorf (
    DorfID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(20)
);

CREATE TABLE Pluenderer (
    PluendererID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(20)
);

CREATE TABLE Dorfbewohner (
    DorfbewohnerID INT AUTO_INCREMENT PRIMARY KEY,
    Vorname VARCHAR(20),
    Nachname VARCHAR(20),
    Beruf VARCHAR(20),
    Geld DECIMAL(7,2),
    DorfID INT,
    Lebenspunkte INT,
    FOREIGN KEY (DorfID) REFERENCES Dorf(DorfID)
);

CREATE TABLE Gegenstand (
    GegenstandID INT AUTO_INCREMENT PRIMARY KEY,
    Bezeichnung VARCHAR(50),
    Preis DECIMAL(6,2)
);

CREATE TABLE Material (
    MaterialID INT AUTO_INCREMENT PRIMARY KEY,
    Bezeichnung VARCHAR(50),
    Preis DECIMAL(6,2)
);

CREATE TABLE besitzt (
    Anzahl INT,
    GegenstandID INT,
    DorfbewohnerID INT,
    FOREIGN KEY (GegenstandID) REFERENCES Gegenstand(GegenstandID),
    FOREIGN KEY (DorfbewohnerID) REFERENCES Dorfbewohner(DorfbewohnerID)
);

CREATE TABLE hat (
    Anzahl INT,
    MaterialID INT,
    DorfbewohnerID INT,
    FOREIGN KEY (MaterialID) REFERENCES Material(MaterialID),
    FOREIGN KEY (DorfbewohnerID) REFERENCES Dorfbewohner(DorfbewohnerID)
);

CREATE TABLE wird_ueberfallen (
    Angriffsdatum DATE,
    DorfID INT,
    PluendererID INT,
    Anzahl INT,
    PRIMARY KEY (DorfID, PluendererID),
    FOREIGN KEY (DorfID) REFERENCES Dorf(DorfID),
    FOREIGN KEY (PluendererID) REFERENCES Pluenderer(PluendererID)
);

INSERT INTO Dorf VALUES
(1,'Freljord'),
(2,'Zlot'),
(3,'Kanto'),
(4,'Alabasta');

INSERT INTO Pluenderer VALUES
(1,'Krieger'),
(2,'Bogenschuetze'),
(3,'Katapultwerfer');

INSERT INTO Dorfbewohner VALUES
(1,'Ornn','Tryndo','Schmied',200.40,1,100),
(2,'Elena','Wagner','Fischerin',99.99,2,85),
(3,'Franky','Toner','Soldat',120.00,1,40),
(4,'Sophie','Weber','Schmiedin',30.99,2,80),
(5,'Max','Schulz','Haendler',300.44,2,65),
(6,'Lea','Hoffmann','Baeuerin',14.29,4,88),
(7,'Neuling','',NULL,0.00,1,100),
(8,'Chopper','Tony','Soldat',274.39,1,90),
(9,'Olaf','Sneg','Soldat',23.82,1,100),
(10,'Gaius','Maximus','Soldat',102.23,4,100),
(11,'Solo','Jundra','Soldat',400.96,4,100),
(12,'Juan','Zon','Soldat',33.49,4,100),
(13,'Nemu','Kohlf','Haendler',174.00,4,96),
(14,'Emon','Saluf','Soldat',50.44,4,100),
(15,'Wender','Mumat','Fischer',34.00,2,99);

INSERT INTO Gegenstand VALUES
(1,'Eisenschwert',65.99),
(2,'Holzschwert',30.45),
(3,'Bogen',50.00),
(4,'Messer',10.75),
(5,'Fisch',7.20),
(6,'Schild',60.00),
(7,'Weizen',4.50),
(8,'Heiltraenk',99.99);

INSERT INTO Material VALUES
(1,'Eisen',14.00),
(2,'Stoecke',5.20),
(3,'Leder',43.99),
(4,'Holz',22.20),
(5,'Smaragde',99.99),
(6,'Faden',3.00);

INSERT INTO besitzt VALUES
(4,1,1),(3,4,1),(10,6,1),
(30,5,2),(2,4,2),
(1,4,3),(1,6,3),
(13,1,4),(3,6,4),
(10,4,5),(2,8,5),(23,7,5),
(53,7,6),(4,4,6),
(1,1,8),
(1,1,9),(1,6,9),
(1,1,10),
(1,1,11),(1,8,11),
(2,4,12),
(3,7,13),(2,3,13),
(1,1,14),(1,6,14),
(20,5,15);

INSERT INTO hat VALUES
(22,1,1),(7,3,1),(80,2,1),(23,4,1),
(12,4,2),(3,6,2),
(3,3,3),
(6,1,4),(22,2,4),
(40,3,5),
(10,4,6),
(4,5,8),
(16,2,9),
(11,5,10),
(34,5,11),
(2,5,12),
(2,5,13),(40,2,13),
(2,1,14),
(5,4,15);

INSERT INTO wird_ueberfallen VALUES
('1450-04-15',1,1,10),
('1450-04-15',1,2,3),
('1450-04-13',3,3,2);
