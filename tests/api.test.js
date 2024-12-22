const { describe, beforeEach } = require("node:test");
const {
  app,
  getAllReviews,
  getAllUsers,
  getReviewById,
  getUserById,
  addReview,
  addNewUser,
} = require("../index.js");
const request = require("supertest");

const http = require("http");

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  getAllReviews: jest.fn(),
  getAllUsers: jest.fn(),
  getReviewById: jest.fn(),
  getUserById: jest.fn(),
  addReview: jest.fn(),
  addNewUser: jest.fn(),
}));

let server;
beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3002, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API TESTING", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should return all the reviews", async () => {
    const mockReviews = [
      {
        id: 1,
        content: "Great Product!",
        userId: 1,
      },
      {
        id: 2,
        content: "Not bad, could be better",
        userId: 2,
      },
    ];

    getAllReviews.mockResolvedValue(mockReviews);
    const result = await request(server).get("/reviews");
    expect(result.body).toEqual(mockReviews);
    expect(result.statusCode).toEqual(200);
  });

  test("should return a review by id", async () => {
    const mockReview = {
      id: 1,
      content: "Great Product!",
      userId: 1,
    };

    getReviewById.mockResolvedValue(mockReview);
    const result = await request(server).get("/review/details/1");
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({ review: mockReview });
  });

  test("should add a new review", async () => {
    const mockReview = {
      content: "Bad Product!",
      userId: 1,
    };

    addReview.mockResolvedValue(mockReview);
    const result = await request(server).post("/review/new").send({
      content: "Bad Product!",
      userId: 1,
    });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({ review: { ...mockReview, id: 3 } });
  });

  test("should return all users", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@email.com",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@email.com",
      },
    ];

    getAllUsers.mockResolvedValue(mockUsers);
    const result = await request(server).get("/users");
    expect(result.body).toEqual(mockUsers);
    expect(result.status).toEqual(200);
  });

  test("should return a specific user by id", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
    };
    getUserById.mockResolvedValue(mockUser);
    const result = await request(server).get("/user/details/1");
    expect(result.body).toEqual({ user: mockUser });
    expect(result.status).toEqual(200);
  });

  test("add a new user", async () => {
    const mockUser = {
      name: "Sudhir",
      email: "sudhir@email.com",
    };
    addNewUser.mockResolvedValue(mockUser);
    const result = await request(server).post("/user/new").send(mockUser);
    expect(result.body).toEqual({ user: { ...mockUser, id: 3 } });
    expect(result.status).toEqual(201);
  });

  test("Should return 404 status for non existing user id", async () => {
    getUserById.mockResolvedValue(null);
    const result = await request(server).get("/user/details/99");
    expect(result.status).toEqual(404);
  });
});
