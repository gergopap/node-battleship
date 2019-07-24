const row = 10;
const col = 10;

const generateBoard = () => {
  let arr = [];
  for (let r = 0; r < row; r++) {
    arr.push([]);
    arr[r].push(new Array(col));
    for (var c = 0; c < col; c++) {
      arr[r][c] = 0;
    }
  }
  return arr;
};

let boardA = generateBoard();
let boardB = generateBoard();

const shoot = (x, y, board) => {
  console.log(x, y, board);
  let shotted = board[x][y];
  if (shotted === 0) {
    board[x][y] = 2;
    return false;
  } else if (shotted === 1) {
    board[x][y] = 3;
    return true;
  }
  return false;
};

module.exports = {
  boardA,
  boardB,
  shoot,
  generateBoard
};
