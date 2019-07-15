const row = 10;
const col = 10;

const generateBoard = () => {
  let array = new Array(row);
  for (let r = 0; r < row; r++) {
    array[r] = new Array(col);
  }
  return array;
};

let boardA = generateBoard();
let boardB = generateBoard();

const update = (newBoard, actualBoard) => {
  for (let r = 0; r < row; r++) {
    actualBoard[r] = new Array(10);
    for (let c = 0; c < col; c++) {
      actualBoard[r][c] = newBoard[r][c];
    }
  }
};

const shoot = (x, y, board) => {
  let shotted = board[x][y];
  if (shotted === 0) {
    board[x][y] = 2;
  } else if (shotted === 1) {
    board[x][y] = 3;
  }
  return board;
};

module.exports = {
  boardA,
  boardB,
  shoot,
  update
};
