var express = require('express');
var router = express.Router();
var con = require('../config/db');

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index');
});

// ADMIN
router.get('/admin', function(req, res, next){
  res.render('admin');
});

router.get('/admin/ancGet', function(req, res, next){
  const announcementsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM announcement', function(err, rows){
      if(err){
        console.error('Cannot load announcements data');
        reject(err);
      }
      else{
        console.log('Announcements data successfully loaded!');
        resolve(rows);
      }
    });
  });
  const imagesQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM images', function(err, rows){
      if(err){
        console.error('Cannot load images data');
        reject(err);
      }
      else{
        console.log('Images data successfully loaded!');
        resolve(rows);
      }
    });
  });
  const commentsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM comments', function(err, rows){
      if(err){
        console.error('Cannot load comments data');
        reject(err);
      }
      else{
        console.log('Comments data successfully loaded!');
        resolve(rows);
      }
    });
  });
  const reactsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM reacts', function(err, rows){
      if(err){
        console.error('Cannot load reacts data');
        reject(err);
      }
      else{
        console.log('Reacts data successfully loaded!');
        resolve(rows);
      }
    });
  });

  Promise.all([announcementsQuery, imagesQuery, commentsQuery, reactsQuery])
  .then(([announcements, images, comments, reacts]) => {
    res.status(200).json({
      announcements: announcements || [],
      images: images || [],
      comments: comments || [],
      reacts: reacts || [],
      success: true,
      message: 'All data successfully loaded!',
    });
  })
  .catch(err => {
    console.error('Error loading data', err);
    res.status(500).json({
      success: false,
      message: 'Cannot load data'
    });
  });
});

// ANNOUNCEMENT
router.post('/admin/ancAdd', function(req, res, next){
  const { title, description, mainImg, galleryImgs } = req.body;
  const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

  con.run('INSERT INTO announcement (AdminID, Title, Description, DatePosted) VALUES(?, ?, ?, ?)', [1, title, description, today], function (err){
    if(err){
      console.log('Cannot add data', err);
      return res.status(500).json({ success: false, message: 'Error inserting data' });
    }
    
    const announcementId = this.lastID;
    
    con.run('INSERT INTO images (AnnouncementID, ImageType, ImagePath) VALUES(?, ?, ?)', [announcementId, 'main', mainImg], (err) => {
      if(err){
        console.log('Cannot add image', err);
        return res.status(500).json({ success: false, message: 'Error inserting main image' });
      }
    });
    galleryImgs.forEach((galleryImg) => {
      con.run('INSERT INTO images (AnnouncementID, ImageType, ImagePath) VALUES(?, ?, ?)', [announcementId, 'gallery', galleryImg], (err) => {
        if(err){
          console.log('Error inserting gallery image', err);
          return res.status(500).json({ success: false, message: 'Error inserting gallery image' });
        }
      });
    });

    res.status(200).json({ success: true, message: 'Record successfully added!' });
  });
});
router.post('/admin/ancUpdate/:id', function(req, res, next){
  const { id } = req.params;
  const { title, description, mainImg, galleryImgs } = req.body;
  const userData = {
    AdminID: 1, // TO CHANGE
    Title: title,
    Description: description,
    DatePosted: new Date(),
  };

  con.query('UPDATE announcement SET ?  WHERE AnnouncementID = ?', [userData, id], (err, row) => {
    if(err){
      console.error('Cannot update data');
    }
    else{
      console.log('Record successfully updated!');
    }
  });
});
router.post('/admin/ancDelete/:id', function(req, res, next){
  var { id } = req.params;
  
  con.query('DELETE FROM announcement WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Cannot delete data');
    }
    else{
      console.log('Record successfully deleted!');
    }
  });
  con.query('DELETE FROM images WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Cannot delete data');
    }
    else{
      console.log('Record successfully deleted!');
    }
  });
});

module.exports = router;