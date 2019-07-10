var boardA = new Array(10);
for (let i = 0; i < 10; i++) {
    boardA[i] = new Array(10);
}

var boardB = new Array(10);
for (let i = 0; i < 10; i++) {
    boardB[i] = new Array(10);
}

function generateBoard(cells, player) {
    const letterCoordinates = Object.keys(cells);
    for (let i = 0; i < letterCoordinates.length; i++) {
        const numberCoordinateObjects = Object.values(cells);
        const numberCoordinateValues = Object.values(numberCoordinateObjects[i]);
        for (let j = 0; j < numberCoordinateValues.length; j++) {
            const cellValue = Object.values(Object.values(cells)[i])[j];
            if (player == 'A') {
                boardA[j][i + 1] = cellValue;
            }
            if (player == 'B') {
                boardB[j][i + 1] = cellValue;
            }
        }
    }
}

const values = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 10
}

function shoot(letterCoordinate, numberCoordinate, board, player) {
    letterCoordinateValue = values[letterCoordinate];
    let cell = board[numberCoordinate - 1][letterCoordinateValue];
    let missed = cell == 0;
    let hit = cell == 1;
    if (missed) {
        setPlayersCellToMissed(player, letterCoordinateValue, numberCoordinate);
    }
    if (hit) {
        setPlayersCellToHit(player, letterCoordinateValue, numberCoordinate)
    }
}

function setPlayersCellToMissed(player, letterCoordinate, numberCoordinate) {
    if (player == 'A') {
        boardA[numberCoordinate - 1][letterCoordinate] = 2;
    }
    if (player == 'B') {
        boardB[numberCoordinate - 1][letterCoordinate] = 2;
    }
}

function setPlayersCellToHit(player, letterCoordinate, numberCoordinate) {
    if (player == 'A') {
        boardA[numberCoordinate - 1][letterCoordinate] = 3;
    }
    if (player == 'B') {
        boardB[numberCoordinate - 1][letterCoordinate] = 3;
    }
}


module.exports = {
    boardA,
    boardB,
    shoot,
    generateBoard
};