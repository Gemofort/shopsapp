const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    required: true
  }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;