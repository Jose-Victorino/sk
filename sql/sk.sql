CREATE TABLE IF NOT EXISTS admin (
    AdminID INTEGER,
    FirstName VARCHAR(45) NOT NULL,
    LastName VARCHAR(45) NOT NULL,
    Username VARCHAR(45) NOT NULL,
    Email VARCHAR(60) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    PRIMARY KEY (AdminID)
);
CREATE TABLE IF NOT EXISTS user (
    UserID INTEGER,
    FirstName VARCHAR(45) NOT NULL,
    LastName VARCHAR(45) NOT NULL,
    Username VARCHAR(45) NOT NULL,
    Email VARCHAR(60) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    PRIMARY KEY (UserID)
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
CREATE TABLE IF NOT EXISTS images (
    ImageID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    ImageType TEXT CHECK(ImageType IN ('main','gallery')) NOT NULL,
    ImagePath VARCHAR(255) NOT NULL,
    PRIMARY KEY (ImageID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID)
);
CREATE TABLE IF NOT EXISTS comments (
    CommentID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    Text LONGTEXT,
    CommentDate DATETIME,
    PRIMARY KEY (CommentID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID),
    FOREIGN KEY (UserID) REFERENCES announcement(UserID)
);
CREATE TABLE IF NOT EXISTS reacts (
    ReactID INTEGER,
    AnnouncementID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    PRIMARY KEY (ReactID),
    FOREIGN KEY (AnnouncementID) REFERENCES announcement(AnnouncementID),
    FOREIGN KEY (UserID) REFERENCES announcement(UserID)
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

--INSERT INTO announcement (AdminID, Title, Description, DatePosted) VALUES(, "", "", "", "");
--UPDATE announcement SET Title = "", Description = "", ScheduledDate = "", DatePosted = ""  WHERE AnnouncementID = ;
--DELETE FROM announcement WHERE AnnouncementID = ;

--INSERT INTO images (AnnouncementID, ImageType, ImagePath) VALUES("", "", "");
--DELETE FROM images WHERE AnnouncementID = ;

DROP TABLE images;
DROP TABLE comments;
DROP TABLE reacts;
DROP TABLE announcement;
DROP TABLE admin;
DROP TABLE `council members`;
DROP TABLE user;

SELECT * FROM images;
SELECT * FROM comments;
SELECT * FROM reacts;
SELECT * FROM announcement;
SELECT * FROM admin;
SELECT * FROM `council members`;
SELECT * FROM user;