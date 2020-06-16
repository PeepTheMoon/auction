const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensureAuth');
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
  })

//get by id to get an auction's details
  .get('/:id', (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('users')
      //come back to populate a list of all bids on the auction!
      .then(auction => res.send(auction))
      .catch(next);
  })

//get all auctions
  .get('/', (req, res, next) => {
    Auction
      .find()
      .then(auctions => res.send(auctions))
      .catch(next);
  });
