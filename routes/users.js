const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

/* register handle */
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  console.log(req.body);
  let errors = [];

  // check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all flields' });
  }

  // check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords doesn\'t match eachother' });
  }

  // check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Pasword is too short, must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation passes
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          //User exists
          errors.push({ msg: 'Email is already registered' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          //Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //set password to hash
              newUser.password = hash;
              //save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            })
          });
        }
      });
  }
});

//Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout handle
router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You\'ve logged out');
  res.redirect('/users/login');
});

module.exports = router;