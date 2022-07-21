const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  cancelledPrice: {
    type: Number,
  },
  category: {
    type: String,
  },
  label: {
    type: String,
  },
  description: {
    type: String,
  },
  features: {
    type: Array,
  },
  imagePaths: {
    type: Array,
  },
});

module.exports = mongoose.model('Product', productSchema);
