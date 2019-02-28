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

router.get('/kek%20shop', ensureAuthenticated, async (req, res) => {
  let results = await getShops();
  res.render('shoppage', {
    shop: results.shop1,
    user: req.user
  });
});

router.get('/U%20ashota', ensureAuthenticated, async (req, res) => {
  let results = await getShops();
  res.render('shoppage', {
    shop: results.shop2,
    user: req.user
  });
});

/* comment handle */
router.post('/U%20ashota', async (req, res) => {
  const { comment } = req.body;
  let results = await getShops();
  let errors = [];
  console.log(req.user);

  // check required fields
  if (!comment) {
    errors.push({ msg: 'Please fill in the flield' });
  }

  if (errors.length > 0) {
    res.render('shoppage', {
      errors,
      shop: results.shop2,
      user: req.user,
    });
  } else {
    Shop.findOne({ name: results.shop2.name })
      .then(shop => {
        if (shop) {

          Shop.updateOne(
            { name: results.shop2.name },
            {
              $set: { comments: results.shop2.comments.push(comment + ' by ' + req.user.name) }
            }
          )
            .then(result => console.log('done'))
            .catch(err => console.log(err));
          res.render('shoppage', {
            shop: results.shop2,
            user: req.user
          });
        } else {
          console.log('Shop does no exist');
        }
      });
  }
});

router.post('/kek%20shop', async (req, res) => {
  const { comment } = req.body;
  let results = await getShops();
  let errors = [];
  console.log(req.user);

  // check required fields
  if (!comment) {
    errors.push({ msg: 'Please fill in the flield' });
  }

  if (errors.length > 0) {
    res.render('shoppage', {
      errors,
      shop: results.shop1,
      user: req.user,
    });
  } else {
    Shop.findOne({ name: results.shop1.name })
      .then(shop => {
        if (shop) {

          Shop.updateOne(
            { name: results.shop1.name },
            {
              $set: { comments: results.shop1.comments.push(comment + ' by ' + req.user.name) }
            }
          )
            .then(result => console.log('done'))
            .catch(err => console.log(err));
          res.render('shoppage', {
            shop: results.shop1,
            user: req.user
          });
        } else {
          console.log('Shop does no exist');
        }
      });
  }
});

module.exports = router;