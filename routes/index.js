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
    res.render('index', {
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
// ADMIN
router.get('/admin', function(req, res){
  res.render('admin');
});

// ANNOUNCEMENT
router.get('/admin/anncGet', function(req, res){
  loadData()
  .then(([announcements, mainImages, galImages, comments]) => {
    res.status(200).json({
      success: true,
      message: 'All data successfully loaded!',
      announcements: announcements || [],
      mainImages: mainImages || [],
      galImages: galImages || [],
      comments: comments || [],
    });
  })
  .catch(err => {
    console.error('Cannot load data', err);
    res.status(500).json({ success: false, message: 'Cannot load data' });
  });
});
router.post('/admin/anncAdd', function(req, res){
  const { title, description, mainImg, galleryImgs } = req.body;

  con.run('INSERT INTO announcement (AdminID, Title, Description, DatePosted) VALUES(?, ?, ?, ?)', [1, title, description, new Date().toISOString()], function (err){
    if(err){
      console.error('Error inserting announcement', err);
      return res.status(500).json({ success: false, message: 'Error inserting announcement' });
    }
    
    const announcementId = this.lastID;
    
    con.run('INSERT INTO `main image` (AnnouncementID, ImagePath) VALUES(?, ?)', [announcementId, mainImg], (err) => {
      if(err){
        console.error('Error inserting main image', err);
        return res.status(500).json({ success: false, message: 'Error inserting main image' });
      }
    });
    for(let i = 0; i < 10; i++){
      con.run('INSERT INTO `gallery images` (AnnouncementID, Pos, ImagePath) VALUES(?, ?, ?)', [announcementId, i, galleryImgs[i]], (err) => {
        if(err){
          console.error('Error inserting gallery image', err);
          return res.status(500).json({ success: false, message: 'Error inserting gallery image' });
        }
      });
    }

    res.status(200).json({ success: true, message: 'Records successfully added!' });
  });
});
router.post('/admin/anncUpdate', function(req, res){
  const { id, title, description, mainImg, galleryImgs } = req.body;

  con.run('UPDATE announcement SET AdminID = ?, Title = ?, Description = ? WHERE AnnouncementID = ?', [1, title, description, id], (err, row) => {
    if(err){
      console.error('Error updating announcement', err);
      return res.status(500).json({ success: false, message: 'Error updating announcement' });
    }
  });
  con.run('UPDATE `main image` SET ImagePath = ? WHERE AnnouncementID = ?', [mainImg, id], (err, row) => {
    if(err){
      console.error('Error updating main image', err);
      return res.status(500).json({ success: false, message: 'Error updating main image' });
    }
  });
  for(let i = 0; i < 10; i++){
    con.run('UPDATE `gallery images` SET ImagePath = ? WHERE Pos = ? AND AnnouncementID = ?', [galleryImgs[i], i, id], (err, row) => {
      if(err){
        console.error('Error updating gallery image', err);
        return res.status(500).json({ success: false, message: 'Error updating gallery image' });
      }
    });
  }

  res.status(200).json({ success: true, message: 'Records successfully updated!' });
});
router.post('/admin/anncDelete', function(req, res){
  var { id } = req.body;
  
  con.run('DELETE FROM `main image` WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting main image', err);
      return res.status(500).json({ success: false, message: 'Error deleting main image' });
    }
  });
  con.run('DELETE FROM `gallery images` WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting gallery image', err);
      return res.status(500).json({ success: false, message: 'Error deleting gallery image' });
    }
  });
  con.run('DELETE FROM comments WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting comments', err);
      return res.status(500).json({ success: false, message: 'Error deleting comments' });
    }
  });
  con.run('DELETE FROM announcement WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting announcement', err);
      return res.status(500).json({ success: false, message: 'Error deleting announcement' });
    }
  });

  res.status(200).json({ success: true, message: 'Records successfully deleted!' });
});

// COUNCIL MEMBERS
router.get('/admin/councilGet', function(req, res){
  con.all('SELECT * FROM `council members`', function(err, rows){
    if(err){
      console.error('Cannot load council members data');
      return res.status(500).json({ success: false, message: 'Cannot load council members data' });
    }

    res.status(200).json({ success: true, message: 'Records successfully loaded!', data: rows });
  });
});
router.post('/admin/councilAdd', function(req, res){
  const { image, firstName, mInitial, lastName, position } = req.body;

  con.run('INSERT INTO `council members` (FirstName, MiddleInitial, LastName, Position, Image) VALUES(?, ?, ?, ?, ?)', [firstName, mInitial, lastName, position, image], (err, row) => {
    if(err){
      console.error('Error inserting council member', err);
      return res.status(500).json({ success: false, message: 'Error inserting council member' });
    }
  });

  res.status(200).json({ success: true, message: 'Record successfully inserted!' });
});
router.post('/admin/councilUpdate', function(req, res){
  const { id, image, firstName, mInitial, lastName, position } = req.body;

  con.run('UPDATE `council members` SET FirstName = ?, MiddleInitial = ?, LastName = ?, Position = ?, Image = ? WHERE CouncilID = ?', [firstName, mInitial, lastName, position, image, id], (err, row) => {
    if(err){
      console.error('Error updating council member', err);
      return res.status(500).json({ success: false, message: 'Error updating council member' });
    }
  });

  res.status(200).json({ success: true, message: 'Records successfully updated!' });
});
router.post('/admin/councilDelete', function(req, res){
  var { id } = req.body;

  con.run('DELETE FROM `council members` WHERE CouncilID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting council member', err);
      return res.status(500).json({ success: false, message: 'Error deleting council member' });
    }
  });

  res.status(200).json({ success: true, message: 'Records successfully deleted!' });
});

module.exports = router;