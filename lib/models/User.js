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
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.passwordHash;
    }
  }
});

//adds bcrypt to turn the user password into a hash with salt rounds for added security
schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

//checks to see if the user is authorized to use the rest of the site by taking in the email and password they provided
schema.statics.authorized = function(email, password) {
  //takes in the entered email and finds it in the database
  return this.findOne({ email })
    .then(user => {
      //if it's not there, throw an error
      if(!user) {
        throw new Error('Invalid email and/or password');
      }
      //if the email is there, but the password is incorrect, throw an error
      if(!user.compare(password)) {
        throw new Error('Invalid email and/or password');
      }
      //otherwise, return the user
      return user;
    });
};

//a compare method to compare the password entered by the user to the hashed password stored in the database's user model
schema.methods.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model('User', schema);
