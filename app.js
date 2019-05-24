const express  = require('express'),
      mongoose = require('mongoose');

const app = express();


app.get('/', (req, res) => {
  res.send('Index Page');
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server on started on port ${port}`);
});
