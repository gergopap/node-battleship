const request = require('supertest');
const app = require('../index');
var game = require('../helpers/BoardHelper');
const url = 'mongodb://localhost:27017';
var MongoClient = require('mongodb').MongoClient;

let db;

let sampleBoard = {
  Board: [
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0]
  ]
};

describe('battleship test', () => {
  before((done) => {
    MongoClient.connect(url, (err, client) => {
      db = client.db('test');
      if (err) return console.log(err);
      db.createCollection('boards')
        .then(() => {
          done();
        });
    });
  });

  beforeEach((done) => {
    let boardA = game.generateBoard();
    console.log(boardA);
    let boardB = game.generateBoard();
    db.collection("boards").deleteMany({}).then(function () {
      db.collection('boards').insertMany([
        { "player": "A", "board": boardA },
        { "player": "B", "board": boardB }
      ]);
    }).then(() => {
      done();
    });
  });

  after((done) => {
    db.collection("boards").drop()
      .then(() => {
        done();
      });
  });



  describe('test GET /boards/playerA', () => {
    it('should return player A board', (done) => {
      request(app)
        .get('/boards/playerA')
        .expect('Content-Type', /json/)
        .expect(200, {
          player: 'A'
        }, done);
    });
  });

  describe('test GET /boards/playerB', () => {
    it('should return Board B', (done) => {
      request(app)
        .get('/boards/playerB')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('test POST /boards/playerA/shoot', () => {
    it('should return hit or miss', (done) => {
      request(app)
        .post('/boards/playerA/shoot')
        .send({ x: 1, y: 1 })
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('test POST /boards/playerB/shoot', () => {
    it('should return hit or miss', (done) => {
      request(app)
        .post('/boards/playerB/shoot')
        .send({ x: 1, y: 1 })
        .expect('Content-type', /json/)
        .end((err, res) => {
          expect(200)
          done();
        });
    });
  });

  describe('test PUT test /boards/playerA', () => {
    it('should update all Board A', (done) => {
      request(app)
        .put('//boards/playerA')
        .send(sampleBoard)
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('test PUT test /boards/playerB', () => {
    it('should update all Board B', (done) => {
      request(app)
        .put('//boards/playerB')
        .send(sampleBoard)
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
  });
});
