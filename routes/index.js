const express  = require('express'),
      router   = express.Router();


// Index route
router.get('/', (req, res) => {
  res.render('index/welcome');
});

// Dashboard route
router.get('/dashboard', (req, res) => {
  res.send('Dashboard');
});

module.exports = router;
