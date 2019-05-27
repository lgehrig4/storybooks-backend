const express  = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport');

// Passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');

const app = express();


app.get('/', (req, res) => {
  res.send('Index Page');
});

// User routes
app.use('/auth', auth);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server on started on port ${port}`);
});
