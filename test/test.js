const request = require('supertest');
const app = require('../index');

describe('test GET /boards/playerA', () => {
  it('should return Board A', function (done) {
    request(app)
      .get('/boards/playerA')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});

describe('test GET /boards/playerB', () => {
  it('should return Board B', function (done) {
    request(app)
      .get('/boards/playerB')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});

describe('test POST /boards/playerA/shoot', () => {
  it('should return hit or miss', (done) => {
    request(app)
      .post('/boards/playerA/shoot')
      .send({ x: 0, y: 0 })
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});

describe('test POST /boards/playerB/shoot', () => {
  it('should return hit or miss', (done) => {
    request(app)
      .post('/boards/playerB/shoot')
      .send({ x: 0, y: 0 })
      .expect('Content-type', /json/)
      .end(function (err, res) {
        expect(200)
        done();
      });
  });
});

let board = {
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

describe('test PUT test /boards/playerA', () => {
  it('should update all Board A', (done) => {
    request(app)
      .put('//boards/playerA')
      .send(board)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});

describe('test PUT test /boards/playerB', () => {
  it('should update all Board B', (done) => {
    request(app)
      .put('//boards/playerB')
      .send(board)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});
