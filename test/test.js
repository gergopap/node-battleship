const request = require('supertest');
const app = require('../index');
const url = 'mongodb://localhost:27017';
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;

const sampleBoard = {
  board: [
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
    MongoClient.connect(url, async (err, client) => {
      db = await client.db('test');
      if (err) return console.log(err);
      db.createCollection('bstest')
        .then(() => {
          let boardA = sampleBoard.Board;
          console.log(boardA);
          let boardB = sampleBoard.Board;
          db.collection("bstest").deleteMany({}).then(() => {
            db.collection('bstest').insertMany([
              { "player": "A", "board": boardA },
              { "player": "B", "board": boardB }
            ]);
          }).then(() => {
            done();
          });
        });
    });
  });

  describe('test GET /boards/playerA', () => {
    it('should return player A board', (done) => {
      request(app)
        .get('/boards/playerA')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(async (res) => {
          let boardA = await db.collection('bstest').findOne({ "player": "A" });
          for (let i = 0; i < res.body.board.length; i++) {
            for (let j = 0; j < res.body.board[i].length; j++) {
              assert.equal(res.body.board[i][j], boardA.board[i][j]);
            }
          }
        }).then(() => {
          done();
        });
    });
  });

  describe('test GET /boards/playerB', () => {
    it('should return Board B', (done) => {
      request(app)
        .get('/boards/playerB')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(async (res) => {
          let boardB = await db.collection('bstest').findOne({ "player": "B" });
          for (let i = 0; i < res.body.board.length; i++) {
            for (let j = 0; j < res.body.board[i].length; j++) {
              assert.equal(res.body.board[i][j], boardB.board[i][j]);
            }
          }
        }).then(() => {
          done();
        });
    });

    describe('test POST /boards/playerA/shoot', () => {
      it('should return hit or miss', (done) => {
        request(app)
          .post('/boards/playerA/shoot')
          .send({ x: 0, y: 0 })
          .expect('Content-type', /json/)
          .expect(200)
          .expect(async (res) => {
            assert.equal(res.body, { "Was hit?": true });
            let boardB = await db.collection('bstest').findOne({ "player": "B" });
            assert.equal(boardB.board[0][0], 3);
          }).then(() => {
            done();
          });
      });
    });
  });

  describe('test POST /boards/playerB/shoot', () => {
    it('should return hit or miss', (done) => {
      request(app)
        .post('/boards/playerB/shoot')
        .send({ x: 1, y: 0 })
        .expect('Content-type', /json/)
        .expect(async (res) => {
          assert.equal(res.body, { "Was hit?": false });
          let boardB = await db.collection('bstest').findOne({ "player": "A" });
          assert.equal(boardB.board[0][0], 2);
        }).then(() => {
          done();
        });
    });
  });

  describe('test PUT test /boards/playerA', () => {
    it('should update all Board A', (done) => {
      request(app)
        .put('/boards/playerA')
        .send(sampleBoard)
        .expect('Content-type', /json/)
        .expect(200)
        .expect(async (res) => {
          let boardA = await db.collection('bstest').findOne({ "player": "A" });
          for (let i = 0; i < res.body.board.length; i++) {
            for (let j = 0; j < res.body.board[i].length; j++) {
              assert.equal(res.body.board[i][j], boardA.board[i][j]);
            }
          }
        }).then(() => {
          done();
        });
    });
  });

  describe('test PUT test /boards/playerB', () => {
    it('should update all Board B', (done) => {
      request(app)
        .put('/boards/playerB')
        .send(sampleBoard)
        .expect('Content-type', /json/)
        .expect(200)
        .expect(async (res) => {
          let boardB = await db.collection('bstest').findOne({ "player": "B" });
          for (let i = 0; i < res.body.board.length; i++) {
            for (let j = 0; j < res.body.board[i].length; j++) {
              assert.equal(res.body.board[i][j], boardB.board[i][j]);
            }
          }
        }).then(() => {
          done();
        });
    });
  });

  after((done) => {
    db.collection("bstest").drop()
      .then(() => {
        done();
      });
  });
});
