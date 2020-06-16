const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },

  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bids',
    required: true
  }],

  quantitySold: {
    type: Number,
    required: true
  },

  soldPrice: {
    type: Number,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  },
  toObject: {
    virtuals: true
  }
});

module.exports = mongoose.model('Auction', schema);
