const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensureAuth');
const User = require('../models/User');
const Auction = require('../models/Auction');

module.exports = Router()
//Post to create a new auction
  .post('/', ensureAuth, (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        title: 'Guitar for sale',
        description: 'Gibson electric guitar',
        quantity: '1',
        end: '2020-07-19'
      })
      .then(auction => res.send(auction))
      .catch(next);
  });

//get by id to get an auction's details

//get all auctions
