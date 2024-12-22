const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

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

async function getAllReviews() {
  return reviews;
}

async function getAllUsers() {
  return users;
}

async function getReviewById(reviewId) {
  return reviews.find((review) => review.id === reviewId);
}

async function getUserById(userId) {
  return users.find((user) => user.id === userId);
}

async function addReview(review) {
  const newReview = {
    id: reviews.length + 1,
    ...review,
  };
  reviews.push(newReview);
  return newReview;
}

async function addNewUser(user) {
  const newUser = {
    id: users.length + 1,
    ...user,
  };
  users.push(newUser);
  return newUser;
}
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/reviews', async (req, res) => {
  const result = await getAllReviews();
  res.json(result);
});

app.get('/users', async (req, res) => {
  const result = await getAllUsers();
  res.json(result);
});

app.get('/review/details/:id', async (req, res) => {
  const result = await getReviewById(parseInt(req.params.id));
  if (result) {
    res.json({ review: result });
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

app.get('/user/details/:id', async (req, res) => {
  const result = await getUserById(parseInt(req.params.id));
  if (result) {
    res.json({ user: result });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/review/new', async (req, res) => {
  const review = req.body;
  const result = await addReview(review);
  res.json({
    review: result,
  });
});

app.post('/user/new', async (req, res) => {
  const user = req.body;
  const result = await addNewUser(user);
  res.json({
    user: result,
  });
});

module.exports = {
  app,
  getAllReviews,
  getAllUsers,
  getReviewById,
  getUserById,
  addReview,
  addNewUser,
};
