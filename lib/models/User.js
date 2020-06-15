const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});
