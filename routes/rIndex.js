var express = require('express');
var router = express.Router();
var con = require('../config/db');

const loadData = (tableNames) => {
  const selectQuery = tableNames.map((tableName) => {
    return new Promise((resolve, reject) => {
      con.all(`SELECT * FROM \`${tableName}\``, function(err, rows){
        if(err){
          console.error(`Cannot load ${tableName} data`, err);
          reject({err, tableName});
        }
        else{
          resolve(rows);
        }
      });
    });
  });

  return Promise.all(selectQuery);
}

const loadAnnc = (id) => {
  const announcementsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM announcement WHERE AnnouncementID = ?', [id], function(err, rows) {
      if(err){
        console.error('Cannot load announcements data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const galImagesQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM `gallery images` WHERE AnnouncementID = ? ORDER BY Pos ASC', [id], function(err, rows) {
      if(err){
        console.error('Cannot load images data');
        reject(err);
      }
      resolve(rows);
    });
  });
  const commentsQuery = new Promise((resolve, reject) => {
    con.all('SELECT * FROM comments WHERE AnnouncementID = ?', [id], function(err, rows) {
      if(err){
        console.error('Cannot load comments data');
        reject(err);
      }
      resolve(rows);
    });
  });

  return Promise.all([announcementsQuery, galImagesQuery, commentsQuery]);
};

// HOME
router.get('/', function(req, res){
  loadData(['announcement', 'gallery images', 'comments', 'council members'])
  .then(([announcements, galImages, comments, councilMembers]) => {
    res.render('home', {
      announcements: announcements || [],
      galImages: galImages || [],
      comments: comments || [],
      councilMembers: councilMembers || [],
    });
  })
  .catch(err => {
    console.error('Cannot load data', err);
    res.status(500).json({ success: false, message: 'Cannot load data' });
  });
});

// ABOUT US
router.get('/AboutUs', function(req, res){
  loadData(['council members'])
  .then(([councilMembers]) => {
    res.render('aboutUs', {
      councilMembers: councilMembers || [],
    });
  })
  .catch((err) => {
    console.error(`Cannot load data`, err);
    res.status(500).json({ success: false, message: `Cannot load data` });
  });
});

// ANNOUNCEMENTS
router.get('/Announcement', function(req, res){
  loadData(['announcement', 'gallery images', 'comments'])
  .then(([announcements, galImages, comments]) => {
    res.render('announcement', {
      announcements: announcements || [],
      galImages: galImages || [],
      comments: comments || [],
    });
  })
  .catch(err => {
    console.error('Cannot load data', err);
    res.status(500).json({ success: false, message: 'Cannot load data' });
  });
});
router.get('/Announcement/:id', function(req, res){
  const { id } = req.params;
  
  loadAnnc(id)
  .then(([announcement, galImages, comments]) => {
    res.render('anncFocus', {
      id,
      announcement: announcement[0] || [],
      galImages: galImages || [],
      comments: comments || [],
    });
  })
  .catch(err => {
    console.error('Cannot load data', err);
    res.status(500).json({ success: false, message: 'Cannot load data' });
  });
});
router.get('/Announcement/:id/getComments', function(req, res){
  const { id } = req.params;

  con.all('SELECT * FROM comments WHERE AnnouncementID = ? ORDER BY CommentDate DESC', [id], function (err, rows){
    if(err){
      console.error('Cannot load data', err);
      res.status(500).json({ success: false, message: 'Cannot load data' });
    }
    res.status(200).json({ success: true, message: 'Records successfully added!', data: rows});
  });
});
router.post('/Announcement/:id/addComment', function(req, res){
  const { id } = req.params;
  const { text } = req.body;
  
  con.run('INSERT INTO comments (AnnouncementID, Text, CommentDate) VALUES(?, ?, ?)', [id, text, new Date().toISOString()], function (err){
    if(err){
      console.error('Cannot load data', err);
      res.status(500).json({ success: false, message: 'Cannot load data' });
    }
    res.status(200).json({ success: true, message: 'Records successfully added!' });
  });
});

// CONTACTS
router.get('/Contact', function(req, res){
  res.render('contact');
});

module.exports = router;