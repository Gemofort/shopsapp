const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

/* DB config*/
const db = require('./config/keys.js').MongoURI;

/* Connect to mongo */
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongo db connected');
  })
  .catch(err => {
    console.log(err);
  });

/* ejs */
app.use(expressLayouts);
app.set('view engine', 'ejs');

/* bodyparser */
app.use(express.urlencoded({ extended: false }));

/* Express session */
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/* Connect flash */
app.use(flash());

/* Global vars */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/* Routes */
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));
app.use('/shops', require('./routes/shops'));

const PORT = process.env.PORT || 2000;

app.listen(PORT, console.log(`Server started on ${PORT}`));

