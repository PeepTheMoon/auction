const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    maxlength: 50,
    required: true
  },

  description: {
    type: String,
    maxlength: 150,
    required: true
  },

  quantity: {
    type: String,
    required: true
  },

  end: {
    type: Date,
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
