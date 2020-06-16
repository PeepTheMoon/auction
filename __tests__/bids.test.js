const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new bid with POST and updates if a user has already bid', async() => {
    const user = await User.create({
      email: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });

    const auction = await Auction.create({
      user: user._id,
      title: 'Guitar for sale',
      description: 'Gibson electric guitar',
      quantity: '1',
      end: '2020-07-19'
    });

    await Bid.create({
      auction: auction._id,
      user: user._id,
      price: 100.00,
      quantity: 1,
      accepted: false
    });

    return request(app)
      .post('/api/v1/bids')
      .auth('cheese@cheesy.com', 'hotcheesesammy')
      .send({
        auction: auction._id,
        user: user._id,
        price: 100.00,
        quantity: 1,
        accepted: false
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: auction.id,
          user: user.id,
          price: 100.00,
          quantity: 1,
          accepted: false,
          __v: 0
        });
      });
  });

  it('gets bid details by id with GET', async() => {
    const user = await User.create({
      email: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });

    const auction = await Auction.create({
      user: user._id,
      title: 'Guitar for sale',
      description: 'Gibson electric guitar',
      quantity: '1',
      end: '2020-07-19'
    });

    const bid = await Bid.create({
      auction: auction._id,
      user: user._id,
      price: 100.00,
      quantity: 1,
      accepted: false
    });

    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .auth('cheese@cheesy.com', 'hotcheesesammy')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: {
            _id: auction.id,
            title: auction.title,
            description: auction.description,
          },
          user: {
            _id: user.id,
            email: user.email
          },
          price: 100.00,
          quantity: 1
        });
      });
  });

  it('deletes a bid with DELETE', async() => {
    const user = await User.create({
      email: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });

    const auction = await Auction.create({
      user: user._id,
      title: 'Guitar for sale',
      description: 'Gibson electric guitar',
      quantity: '1',
      end: '2020-07-19'
    });

    const bid = await Bid.create({
      auction: auction._id,
      user: user._id,
      price: 100.00,
      quantity: 1,
      accepted: false
    });

    return request(app)
      .delete(`/api/v1/bids/${bid._id}`)
      .auth('cheese@cheesy.com', 'hotcheesesammy')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: auction.id,
          user: user.id,
          price: 100.00,
          quantity: 1,
          accepted: false,
          __v: 0
        });
      });
  });

});
