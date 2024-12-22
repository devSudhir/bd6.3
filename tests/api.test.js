const { describe, beforeEach } = require('node:test');
const {
  app,
  getAllReviews,
  getAllUsers,
  getReviewById,
  getUserById,
  addReview,
  addNewUser,
} = require('../index.js');
const request = require('supertest');

const http = require('http');

jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getAllReviews: jest.fn(),
  getAllUsers: jest.fn(),
  getReviewById: jest.fn(),
  getUserById: jest.fn(),
  addReview: jest.fn(),
  addNewUser: jest.fn(),
}));

let server;
beforeAll((done) => {
  server = http.createServer();
  server.listen(3002, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API TESTING', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should return all the reviews', async () => {
    const reviews = [
      {
        id: 1,
        content: 'Great Product!',
        userId: 1,
      },
      {
        id: 2,
        content: 'Not bad, could be better',
        userId: 2,
      },
    ];

    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
      },
    ];

    const mockReviews = [
      {
        id: 1,
        content: 'Great Product!',
        userId: 1,
      },
      {
        id: 2,
        content: 'Not bad, could be better',
        userId: 2,
      },
    ];

    getAllReviews.mockResolvedValue(mockReviews);
    const result = await request(server).get('/reviews');
    expect(result.body).toEqual(mockReviews);
    expect(result.statusCode).toEqual(200);
  });
});
