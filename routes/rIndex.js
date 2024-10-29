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
  res.render('announcement');
});

// CONTACTS
router.get('/Contact', function(req, res){
  res.render('contact');
});

module.exports = router;