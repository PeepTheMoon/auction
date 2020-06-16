const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensureAuth');
const Bid = require('../models/Bid');

module.exports = Router()

//Post to create a new bid or update a bid if the user has already placed a bid
  .post('/', ensureAuth, (req, res, next) => {
    Bid 
      .findOneAndUpdate({ 
        auction: req.body.auction,
        user: req.body.user 
      },
      req.body, {
        new: true,
        upsert: true 
      })
      .then(bid => res.send(bid))
      .catch(next);
  })

//Get by id to get bid details
//should this be using ensureAuth?
  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('auction', { 
        title: true, 
        description: true 
      })
      .populate('user', { 
        email: true 
      })
      .select({ 
        price: true, 
        quantity: true 
      })
      .then(bid => res.send(bid))
      .catch(next);
  })

//delete route to delete a bid
  .delete('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
