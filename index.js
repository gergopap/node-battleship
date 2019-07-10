const express = require('express');
const app = express();
const board = require('./helpers/BoardHelper');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');

app.listen(8000, () => {
  console.log(`Running on port 8000...`);
});

app.get('/', function (req, res) {
  res.render('index', { title: 'Battleship' })
});

app.get('/boards/playerA', function (req, res) {
  res.render('playerABoard', {board: board.boardA});
});

app.get('/boards/playerB', function (req, res) {
  res.render('playerBBoard', {board: board.boardB});
});

app.post('/boards/playerA/shoot', function (req, res) {
  const letterCoordinate = req.body.letterCoordinate;
  const numberCoordinate = req.body.numberCoordinate;
  const boardA = board.boardA;
  const playerA = 'A';
    board.shoot(letterCoordinate, numberCoordinate, boardA, playerA);
    res.render('playerABoard', { board: boardA });  
});

app.post('/boards/playerB/shoot', function (req, res) {
  const letterCoordinate = req.body.letterCoordinate;
  const numberCoordinate = req.body.numberCoordinate;
  const boardB = board.boardB;
  const playerB = 'B';
  board.shoot(letterCoordinate, numberCoordinate, boardB, playerB);
    res.render('playerBBoard', { board: boardB });
});

app.put('/boards/playerA', function (req, res) {
  board.generateBoard(req.body, 'A');
  res.render('playerABoard', { board: board.boardA });
});

app.put('/boards/playerB', function (req, res) {
  board.generateBoard(req.body, 'B');
  res.render('playerBBoard', { board: board.boardB });
});
