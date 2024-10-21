CREATE TABLE IF NOT EXISTS admin (
    AdminID INTEGER,
    FirstName VARCHAR(45) NOT NULL,
    LastName VARCHAR(45) NOT NULL,
    Username VARCHAR(45) NOT NULL,
    Email VARCHAR(60) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    PRIMARY KEY (AdminID)
);
CREATE TABLE IF NOT EXISTS announcement (
    AnnouncementID INTEGER,
    AdminID INTEGER NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description LONGTEXT,
    DatePosted DATETIME,
    PRIMARY KEY (AnnouncementID),
    FOREIGN KEY (AdminID) REFERENCES admin(AdminID)
);
CREATE TABLE IF NOT EXISTS `main image` (
    ImageID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    ImagePath VARCHAR(255) NOT NULL,
    PRIMARY KEY (ImageID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID)
);
CREATE TABLE IF NOT EXISTS `gallery images` (
    ImageID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    Pos INTEGER NOT NULL,
    ImagePath VARCHAR(255),
    PRIMARY KEY (ImageID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID)
);
CREATE TABLE IF NOT EXISTS comments (
    CommentID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    Text LONGTEXT,
    CommentDate DATETIME,
    PRIMARY KEY (CommentID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID)
);
CREATE TABLE IF NOT EXISTS `council members` (
    CouncilID INTEGER,
    FirstName VARCHAR(45) NOT NULL,
    MiddleInitial VARCHAR(45) NOT NULL,
    LastName VARCHAR(45) NOT NULL,
    Position TEXT CHECK(Position IN ('Chairperson', 'Co-Chairperson', 'Treasurer', 'Secretary', 'SK Kagawad')) NOT NULL,
    Image VARCHAR(255) NOT NULL,
    PRIMARY KEY (CouncilID)
);

--INSERT INTO admin (FirstName, LastName, Username, Email, Password) VALUES("last", "first", "bim", "@fafe", "qwerty");
--UPDATE admin SET FirstName = "", LastName = "", Username = "", Email = "", Password = "" WHERE AdminID = ;
--DELETE FROM admin WHERE AdminID = ;

--INSERT INTO announcement (AdminID, Title, Description, DatePosted) VALUES(, "", "", "");
--UPDATE announcement SET AdminID = , Title = "", Description = ""  WHERE AnnouncementID = ;
--DELETE FROM announcement WHERE AnnouncementID = ;

--INSERT INTO `main image` (AnnouncementID, ImagePath) VALUES(, "");
--UPDATE `main image` SET ImagePath = "" WHERE AnnouncementID = ;
--DELETE FROM images WHERE AnnouncementID = ;

--INSERT INTO `gallery images` (AnnouncementID, Pos, ImagePath) VALUES(, , "");
--UPDATE `gallery images` SET ImagePath = "" WHERE Pos =  AND AnnouncementID = ;
--DELETE FROM images WHERE AnnouncementID = ;

--INSERT INTO comments (AnnouncementID, Text, CommentDate) VALUES(, "", "");
--DELETE FROM comments WHERE AnnouncementID = ;

SELECT * FROM `main image`;
SELECT * FROM `gallery images` WHERE ImagePath NOT NULL ORDER BY Pos ASC;
SELECT * FROM comments;
SELECT * FROM announcement;
SELECT * FROM admin;
SELECT * FROM `council members`;

/*
DROP TABLE `main image`;
DROP TABLE `gallery images`;
DROP TABLE comments;
DROP TABLE announcement;
DROP TABLE admin;
DROP TABLE `council members`;
*/