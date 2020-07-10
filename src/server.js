require('dotenv-safe').config();
const privateKey = process.env.SECRET;

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { authenticate, authorize } = require('./auth');
const songs = require('./songs');

const app = express();
const port = process.env.PORT || 3333;

// Middlewares
app.use(express.json());
app.use(cookieParser(privateKey));

const publicDir = path.join(__dirname, '../public');
app.use('/', express.static(publicDir));

// Routes
app.get('/songs', (req, res) => {
  return res.send(songs);
});

app.get('/songs/:id', (req, res) => {
  return res.send(songs[req.params.id - 1]);
});

app.post('/songs', authorize, (req, res) => {
  req.body.user = req.user;
  songs.push(req.body);
  return res.send(songs);
});

app.post('/auth', authenticate);

app.listen(port, () => {
  console.log(`Server is running @ http://localhost:${port}`)
});