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

router.get('/', function(req, res){
  res.render('admin');
});

// ANNOUNCEMENT
router.get('/anncGet', function(req, res){
  loadData(['announcement', 'gallery images', 'comments'])
  .then(([announcements, galImages, comments]) => {
    res.status(200).json({
      success: true,
      message: 'All data successfully loaded!',
      announcements: announcements || [],
      galImages: galImages || [],
      comments: comments || [],
    });
  })
  .catch(({err, tableName}) => {
    console.error(`Cannot load ${tableName}`, err);
    res.status(500).json({ success: false, message: `Cannot load ${tableName}` });
  });
});
router.post('/anncAdd', function(req, res){
  const { title, description, mainImg, galleryImgs } = req.body;

  con.run('INSERT INTO announcement (AdminID, Title, Description, Image, DatePosted) VALUES(?, ?, ?, ?, ?)', [1, title, description, mainImg, new Date().toISOString()], function (err){
    if(err){
      console.error('Error inserting announcement', err);
      return res.status(500).json({ success: false, message: 'Error inserting announcement' });
    }
    
    const announcementId = this.lastID;

    for(let i = 0; i < 20; i++){
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
router.post('/anncUpdate', function(req, res){
  const { id, title, description, mainImg, galleryImgs } = req.body;

  con.run('UPDATE announcement SET AdminID = ?, Title = ?, Description = ?, Image = ? WHERE AnnouncementID = ?', [1, title, description, mainImg, id], (err, row) => {
    if(err){
      console.error('Error updating announcement', err);
      return res.status(500).json({ success: false, message: 'Error updating announcement' });
    }
  });
  for(let i = 0; i < 20; i++){
    con.run('UPDATE `gallery images` SET ImagePath = ? WHERE Pos = ? AND AnnouncementID = ?', [galleryImgs[i], i, id], (err, row) => {
      if(err){
        console.error('Error updating gallery image', err);
        return res.status(500).json({ success: false, message: 'Error updating gallery image' });
      }
    });
  }
  res.status(200).json({ success: true, message: 'Records successfully updated!' });
});
router.post('/anncDelete', function(req, res){
  const { id } = req.body;

  con.run('DELETE FROM `gallery images` WHERE AnnouncementID = ?', id, (err, row) => {
    if(err){
      console.error('Error deleting gallery images', err);
      return res.status(500).json({ success: false, message: 'Error deleting gallery images' });
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
router.get('/councilGet', function(req, res){
  loadData(['council members'])
  .then(([councilMembers]) => {
    res.status(200).json({
      success: true,
      message: 'Records successfully loaded!',
      councilMembers: councilMembers || [],
    });
  })
  .catch(({err, tableName}) => {
    console.error('Cannot load council members data', err);
    res.status(500).json({ success: false, message: 'Cannot load council members data' });
  });
});
router.post('/councilAdd', function(req, res){
  const { image, firstName, mInitial, lastName, position } = req.body;

  con.run('INSERT INTO `council members` (FirstName, MiddleInitial, LastName, Position, Image) VALUES(?, ?, ?, ?, ?)', [firstName, mInitial, lastName, position, image], (err, row) => {
    if(err){
      console.error('Error inserting council member', err);
      return res.status(500).json({ success: false, message: 'Error inserting council member' });
    }
  });
  res.status(200).json({ success: true, message: 'Record successfully inserted!' });
});
router.post('/councilUpdate', function(req, res){
  const { id, image, firstName, mInitial, lastName, position } = req.body;

  con.run('UPDATE `council members` SET FirstName = ?, MiddleInitial = ?, LastName = ?, Position = ?, Image = ? WHERE CouncilID = ?', [firstName, mInitial, lastName, position, image, id], (err, row) => {
    if(err){
      console.error('Error updating council member', err);
      return res.status(500).json({ success: false, message: 'Error updating council member' });
    }
  });
  res.status(200).json({ success: true, message: 'Records successfully updated!' });
});
router.post('/councilDelete', function(req, res){
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