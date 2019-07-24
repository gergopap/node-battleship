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

MongoClient.connect(url, async (err, client) => {
  db = await client.db('battleship');
  if (err) return console.log(err);
  app.listen(3000, () => {
    console.log('Running on port on 3000...');
  });
  return db;
});

app.get('/boards/playerA', async (req, res) => {
  let boardA = await db.collection('boards').findOne({ "player": "A" });
  res.json(boardA.board)
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

app.get('/boards/playerB', async (req, res) => {
  let boardB = await db.collection('boards').findOne({ "player": "B" });
  res.json(boardB.board)
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

app.post('/boards/playerA/shoot', async (req, res) => {
  let boardB = await db.collection('boards').findOne({ "player": "B" });
  let shotted = await game.shoot(req.body.x, req.body.y, boardB.board);
  db.collection('boards').updateOne(
    { "player": "B" },
    {
      $set: {
        "board": boardB.board
      }
    }).then(() => {
      if (shotted) {
        res.json({ "Was hit?": true })
          .catch(error => {
            res.status(500).json({ error: error });
          });
      } else {
        res.json({ "Was hit?": false })
          .catch(error => {
            res.status(500).json({ error: error });
          });
      }
    });
});

app.post('/boards/playerB/shoot', async (req, res) => {
  let boardA = await db.collection('boards').findOne({ "player": "A" })
  let shotted = await game.shoot(req.body.x, req.body.y, boardA.board);
  db.collection('boards').updateOne(
    { "player": "A" },
    {
      $set: {
        "board": boardA.board
      }
    }).then(() => {
      if (shotted) {
        res.json({ "Was hit?": true })
          .catch(error => {
            res.status(500).json({ error: error });
          });
      } else {
        res.json({ "Was hit?": false })
          .catch(error => {
            res.status(500).json({ error: error });
          });
      }
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
        .then((boardA) => { res.json(boardA.board) }))
    .catch(error => {
      res.status(500).json({ error: error });
    });
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
        .then((boardB) => { res.json(boardB.board) }))
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

module.exports = app;
