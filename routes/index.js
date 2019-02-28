const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth.js');

const Shop = require('../models/Shop');

let shop1 = Shop.findOne({ name: 'kek shop' })
  .then(result => { return (result) });

let shop2 = Shop.findOne({ name: 'U ashota' })
  .then(result => { return (result) });

const getShops = async () => {
  return {
    shop1: await shop1,
    shop2: await shop2
  };
};

//Main
router.get('/', async (req, res) => {
  let results = await getShops();
  res.render('mainpage', {
    shop1: results.shop1,
    shop2: results.shop2
  });
});

router.get('/welcome', (req, res) => {
  res.render('welcome');
})

//Logout
router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You\'ve logged out');
  res.redirect('/users/login');
});

//Welcome page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  res.render('dashboard', {
    user: req.user
  });
});

module.exports = router;