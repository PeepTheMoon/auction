const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');

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

  it('creates a new auction with POST', async() => {
    const user = await User.create({
      email: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });

    return request(app)
      .post('/api/v1/auctions')
      .auth('cheese@cheesy.com', 'hotcheesesammy')
      .send({
        user: user._id,
        title: 'Guitar for sale',
        description: 'Gibson electric guitar',
        quantity: '1',
        end: '2020-07-19'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'Guitar for sale',
          description: 'Gibson electric guitar',
          quantity: '1',
          end: '2020-07-19T00:00:00.000Z',
          __v: 0
        });
      });
  });

  it('gets auction details by id with GET', async() => {
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

    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'Guitar for sale',
          description: 'Gibson electric guitar',
          quantity: '1',
          end: '2020-07-19T00:00:00.000Z',
          __v: 0
        });
      });
  });

  it('gets all auctions with GET', async() => {
    const user = await User.create({
      email: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });

    await Auction.create({
      user: user._id,
      title: 'Guitar for sale',
      description: 'Gibson electric guitar',
      quantity: '1',
      end: '2020-07-19'
    });

    return request(app)
      .get('/api/v1/auctions')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          user: user.id,
          title: 'Guitar for sale',
          description: 'Gibson electric guitar',
          quantity: '1',
          end: '2020-07-19T00:00:00.000Z',
          __v: 0
        }]);
      });
  });


});
