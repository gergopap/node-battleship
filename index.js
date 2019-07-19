const express = require('express');
const app = express();
const game = require('./helpers/BoardHelper');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
var cors = require('cors');

let db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'jade');

MongoClient.connect(url, (err, client) => {
  db = client.db('battleship');
  if (err) return console.log(err);
  app.listen(3000, () => {
    console.log('Running on port on 3000...');
  });
  return db;
});

app.get('/boards/playerA', (req, res) => {
  db.collection('boards').findOne({ "player": "A" })
    .then((boardA) => { res.json(boardA.board) });
});

app.get('/boards/playerB', (req, res) => {
  db.collection('boards').findOne({ "player": "B" })
    .then((boardB) => { res.json(boardB.board) });
});

app.post('/boards/playerA/shoot', (req, res) => {
  db.collection('boards').findOne({ "player": "B" })
    .then((boardB) => {
      let shotted = game.shoot(req.body.x, req.body.y, boardB.board);
      db.collection('boards').updateOne(
        { "player": "B" },
        {
          $set: {
            "board": boardB.board
          }
        }).then(() => {
          if (shotted) {
            res.json({ "Was hit?": true });
          } else {
            res.json({ "Was hit?": false });
          }
        });
    });
});

app.post('/boards/playerB/shoot', (req, res) => {
  db.collection('boards').findOne({ "player": "A" })
    .then((boardA) => {
      let shotted = game.shoot(req.body.x, req.body.y, boardA.board);
      db.collection('boards').updateOne(
        { "player": "A" },
        {
          $set: {
            "board": boardA.board
          }
        }).then(() => {
          if (shotted) {
            res.json({ "Was hit?": true });
          } else {
            res.json({ "Was hit?": false });
          }
        });
    });
});

app.put('/boards/playerA', (req, res) => {
  let boardA = req.body.board;
  console.log(boardA);
  db.collection('boards').updateOne(
    { "player": "A" },
    {
      $set: {
        "board": boardA
      }
    }).then(() =>
      db.collection('boards').findOne({ "player": "A" })
        .then((boardA) => { res.json(boardA.board) }));
});

app.put('/boards/playerB', (req, res) => {
  let boardB = req.body.board;
  console.log(boardB);
  db.collection('boards').updateOne(
    { "player": "B" },
    {
      $set: {
        "board": boardB
      }
    }).then(() =>
      db.collection('boards').findOne({ "player": "B" })
        .then((boardB) => { res.json(boardB.board) }));
});

module.exports = app;
