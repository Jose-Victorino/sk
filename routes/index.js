var express = require('express');
var router = express.Router();
var con = require('../config/db');

const loadData = () => {
  const announcementsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM announcement ORDER BY DatePosted DESC', function(err, rows){
      if(err){
        console.error('Cannot load announcements data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const mainImagesQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM `main image`', function(err, rows){
      if(err){
        console.error('Cannot load images data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const galImagesQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM `gallery images` WHERE ImagePath NOT NULL ORDER BY Pos ASC', function(err, rows){
      if(err){
        console.error('Cannot load images data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const commentsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM comments', function(err, rows){
      if(err){
        console.error('Cannot load comments data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const councilMembersQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM `council members`', function(err, rows){
      if(err){
        console.error('Cannot load council members data');
        reject(err);
      }
      resolve(rows);
    });
  });

  return Promise.all([announcementsQuery, mainImagesQuery, galImagesQuery, commentsQuery, councilMembersQuery])
}

// HOME
router.get('/', function(req, res){
  loadData()
  .then(([announcements, mainImages, galImages, comments, council]) => {
    res.render('home', {
      success: true,
      message: 'All data successfully loaded!',
      announcements: announcements || [],
      mainImages: mainImages || [],
      galImages: galImages || [],
      comments: comments || [],
      council: council || [],
    });
  })
  .catch(err => {
    console.error('Cannot load data', err);
    res.status(500).json({ success: false, message: 'Cannot load data' });
  });
});

// ABOUT US
router.get('/AboutUs', function(req, res){
  res.render('aboutUs');
});

// ANNOUNCEMENTS
router.get('/Announcement', function(req, res){
  res.render('announcement');
});

// CONTACTS
router.get('/Contact', function(req, res){
  res.render('contact');
});

module.exports = router;