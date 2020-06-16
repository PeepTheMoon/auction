const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensureAuth');
const Auction = require('../models/Auction');
const User = require('../models/User');
const Bid = require('../models/Bid');

module.exports = Router()

//Post to create a new bid or update a bid if the user has already placed a bid
  .post('/', ensureAuth, (req, res, next) => {
    Bid 
      // .create({
      //   auction: req.auction._id,
      //   user: req.user._id,
      //   price: 100.00,
      //   quantity: 1,
      //   accepted: false
      // })
      .findOneAndUpdate({ auction: req.body.auction,
        user: req.body.user },
      req.body, {
        new: true,
        upsert: true 
      })
      .then(bid => res.send(bid))
      .catch(next);
  });

//Get by id to get bid details

//delete route to delete a bid



