const express = require('express');
const app = express();
const game = require('./helpers/BoardHelper');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const http = require('http');
let db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');

MongoClient.connect(url, (err, client) => {
  db = client.db('bsDB');
  if (err) return console.log(err);
  app.listen(3000, () => {
    console.log('Running on port on 3000...');
  });
  return db;
});

app.get('/boards/playerA', (req, res) => {
  db.collection('playerA').findOne()
    .then((boardA) => { res.json(boardA) });
});

app.get('/boards/playerB', (req, res) => {
  db.collection('playerB').findOne()
    .then((boardB) => { res.json(boardB) });
});

app.post('/boards/playerA/shoot', (req, res) => {
  let shotted = game.shoot(req.body.x, req.body.y, game.boardA);
  db.collection('playerA').updateOne({
    $set: {
      "BoardA": game.boardA
    }
  }).then(() => {
    if (shotted === 3) {
      res.json({ "hit": true });
    } else {
      res.json({ "hit": false });
    }
  });
});

app.post('/boards/playerB/shoot', (req, res) => {
  let shotted = game.shoot(req.body.x, req.body.y, game.boardB);
  db.collection('playerB').updateOne({
    $set: {
      "boardB": game.boardB
    }
  }).then(() => {
    if (shotted === 3) {
      res.json({ "hit": true });
    } else {
      res.json({ "hit": false });
    }
  });
});

app.put('/boards/playerA', (req, res) => {
  game.update(req.body.board, game.boardA);
  db.collection('playerA').updateOne({
    $set: {
      "BoardA": game.boardA
    }
  }
  ).then(() => res.json(game.boardA));
});

app.put('/boards/playerB', (req, res) => {
  game.update(req.body.board, game.boardA);
  db.collection('playerB').updateOne({
    $set: {
      "BoardB": game.boardB
    }
  }).then(() => res.json(game.boardA));
});

module.exports = app;
