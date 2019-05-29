const express      = require('express'),
      exphbs       = require('express-handlebars'),
      mongoose     = require('mongoose'),
      cookieParser = require('cookie-parser'),
      session      = require('express-session'),
      passport     = require('passport');

// Load User model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Map global promise
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/', index);
app.use('/auth', auth);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server on started on port ${port}`);
});
