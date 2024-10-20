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
  const imagesQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM images', function(err, rows){
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
  // const councilMembersQuery = new Promise((resolve, reject) => {
  //   con.all('SELECT * FROM `council members`', function(err, rows){
  //     if(err){
  //       console.error('Cannot load council members data');
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });

  return Promise.all([announcementsQuery, imagesQuery, commentsQuery])
}

// HOME
router.get('/', function(req, res, next){
  loadData()
  .then(([announcements, images, comments]) => {
    res.render('index', {
      announcements: announcements || [],
      images: images || [],
      comments: comments || [],
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
// ADMIN
router.get('/admin', function(req, res, next){
  loadData()
  .then(([announcements, images, comments]) => {
    res.render('admin', {
      announcements: announcements || [],
      images: images || [],
      comments: comments || [],
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

router.get('/admin/ancGet', function(req, res, next){
  loadData()
  .then(([announcements, images, comments]) => {
    res.status(200).json({
      success: true,
      message: 'All data successfully loaded!',
      announcements: announcements || [],
      images: images || [],
      comments: comments || [],
    });
  })
  .catch(err => {
    console.error('Error loading data', err);
    res.status(500).json({
      success: false,
      message: 'Cannot load data',
    });
  });
});
// ANNOUNCEMENT
router.post('/admin/ancAdd', function(req, res, next){
  const { title, description, mainImg, galleryImgs } = req.body;

  con.run('INSERT INTO announcement (AdminID, Title, Description, DatePosted) VALUES(?, ?, ?, ?)', [1, title, description, new Date()], function (err){
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
    for(const galleryImg of galleryImgs){
      con.run('INSERT INTO images (AnnouncementID, ImageType, ImagePath) VALUES(?, ?, ?)', [announcementId, 'gallery', galleryImg], (err) => {
        if(err){
          console.log('Error inserting gallery image', err);
          return res.status(500).json({ success: false, message: 'Error inserting gallery image' });
        }
      });
    }

    res.status(200).json({ success: true, message: 'Record successfully added!' });
  });
});
router.post('/admin/ancUpdate', function(req, res, next){
  const { id, title, description, mainImg, galleryImgs } = req.body;

  con.run('UPDATE announcement SET AdminID = ?, Title = ?, Description = ? WHERE AnnouncementID = ?', [1, title, description, id], (err, row) => {
    if(err){
      return res.status(500).json({ success: false, message: 'Error updating announcement' });
    }
  });
});
router.post('/admin/ancDelete', function(req, res, next){
  var { id } = req.body;
  
  con.run('DELETE FROM images WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.log('Error deleting announcement', err);
      return res.status(500).json({ success: false, message: 'Error deleting announcement' });
    }
  });
  con.run('DELETE FROM comments WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.log('Error deleting announcement', err);
      return res.status(500).json({ success: false, message: 'Error deleting announcement' });
    }
  });
  con.run('DELETE FROM announcement WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.log('Error deleting announcement', err);
      return res.status(500).json({ success: false, message: 'Error deleting announcement' });
    }
  });

  res.status(200).json({ success: true, message: 'Record successfully deleted!' });
});

module.exports = router;