const express = require('express');
const path = require('path');

const { authenticate, verifyAuth } = require('./auth');
const songs = require('./songs');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3333;

// EJS

const publicDir = path.join(__dirname, 'static');
app.use('/', express.static(publicDir));
app.set('views', publicDir);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes

app.get('/songs', (req, res) => {
  return res.send(songs);
})

app.get('/songs/:id', (req, res) => {
  return res.send(songs[req.params.id - 1]);
})

app.post('/songs', verifyAuth, (req, res) => {
  req.body.user = req.user;
  songs.push(req.body);
  return res.send(songs);
});

app.post('/auth', authenticate);

app.listen(port, () => {
  console.log(`Server is running @ http://localhost:${port}`)
});