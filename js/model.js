var TETRIS = TETRIS || {};

TETRIS.Model = ( function(TetMaker) {
  'use strict';

  let board, tetromino;
  let score = 0;
  let _prevTetris = false;
  let gameOver = false;

  let init = () => {
    board = _generateBoard();
    tetromino = new TetMaker.Tetromino();
  };


  // Board is generated as a 10 "width" by 20 "height"
  // two-dimensional array of zeroes.

  let _generateBoard = () => {
    let board = [];
    for (let i = 0; i < 20; i++) {
      let row = new Array(10).fill(0);
      board.push(row);
    }
    return board;
  };


  let _setGameOver = () => {
    gameOver = true;
  };


  let _addScore = (amount) => {
    return score += amount;
  };


  // Score increases based on lines cleared, but tetris (4x) is special case.
  // Uses _prevTetris variable for consecutive tetris bonus.

  let _updateScore = (tetris, numLines) => {
    if (tetris) {
      _addScore(800);
      if (_prevTetris) _addScore(400);
      _prevTetris = true;
    } else {
      _prevTetris = false;
      _addScore(100 * numLines);
    }
  };


  let _outOfBounds = (y, x) => {
    if (y > 19 || x < 0 || x > 9) {
      return true;
    } else {
      return false;
    }
  };


  // Collision check is performed by iterating through tetromino state
  // and board state. Tetromino location is referenced by its state's
  // "top-left" element.

  let _collision = (tetroclone, board) => {
    let state = tetroclone.getState();
    let location = tetroclone.getLocation();
    for (let rowIdx = 0; rowIdx < state.length; rowIdx++) {
      for (let blockIdx = 0; blockIdx < state[rowIdx].length; blockIdx++) {
        if (state[rowIdx][blockIdx]) {
          let y = location[0] + rowIdx;
          let x = location[1] + blockIdx;
          if (_outOfBounds(y, x) || board[y][x]) return true;
        }
      }
    }
    return false;
  };


  // Board absorbs tetromino blocks, triggered on collision.

  let _merge = (tetromino, board) => {
    let state = tetromino.getState();
    let color = tetromino.getColor();
    let location = tetromino.getLocation();
    for (let rowIdx = 0; rowIdx < state.length; rowIdx++) {
      for (let blockIdx = 0; blockIdx < state[rowIdx].length; blockIdx++) {
        if (state[rowIdx][blockIdx]) {
          let y = location[0] + rowIdx;
          let x = location[1] + blockIdx;
          board[y][x] = color;
        }
      }
    }
    _spawn();
  };


  // Triggers every time a tetromino is merged with the board.
  // Game over occurs if new tetromino spawns with collision.
  // Otherwise, model tetromino points to new tetromino.

  let _spawn = () => {
    let newTetromino = new TetMaker.Tetromino();
    if (_collision(newTetromino, board)) {
      _setGameOver();
    } else {
      tetromino = newTetromino;
    }
  };


  // All movement and rotation is checked for validity by cloning the
  // tetromino, performing the movement with the tetroclone, then checking for
  // collision or out of bounds on the clone.

  let rotate = () => {
    let tetroclone = tetromino.clone();
    tetroclone.rotate();
    if (!_collision(tetroclone, board)) {
      tetromino.rotate();
      return true;
    } else {
      return false;
    }
  };


  let moveLeft = () => {
    let tetroclone = tetromino.clone();
    tetroclone.moveLeft();
    if (!_collision(tetroclone, board)) {
      tetromino.moveLeft();
      return true;
    } else {
      return false;
    }
  };


  let moveRight = () => {
    let tetroclone = tetromino.clone();
    tetroclone.moveRight();
    if (!_collision(tetroclone, board)) {
      tetromino.moveRight();
      return true;
    } else {
      return false;
    }
  };


  // Tic is the tetromino's natural falling movement. Called on interval
  // from the controller and whenever the down key is pressed.

  let tic = () => {
    let tetroclone = tetromino.clone();
    tetroclone.tic();
    if (!_collision(tetroclone, board)) {
      tetromino.tic();
      return true;
    } else {
      _merge(tetromino, board);
      return false;
    }
  };


  // Drops tetromino as low as it can go by looping the tic method
  // until it returns false due to collision.

  let drop = () => {
    let finished = false;
    while (!finished) {
      if (!tic()) finished = true;
    }
  };


  // Checks which lines need to be cleared and checks if there is a tetris
  // (four in a row), then updates the score based on that information.

  let clearLines = () => {
    let lines = [];
    let consecutiveLines = 0;
    let tetris = false;
    board.forEach( function(row, index) {
      if (row.every( function(block) { return block })) {
        consecutiveLines++;
        if (consecutiveLines > 3) tetris = true;
        lines.push(index);
      } else {
        consecutiveLines = 0;
      }
    })
    if (lines.length) {
      _updateScore(tetris, lines.length);
      return lines;
    } else {
      return false;
    }
  };


  // Takes indices for lines meant to be cleared and
  // splices them out of the board.

  let deleteLinesFromBoard = (lineIndices) => {
    if (lineIndices) {
      lineIndices.sort();
      for (let i = lineIndices.length - 1; i >= 0; i--) {
        board.splice(lineIndices[i], 1);
      }
      for (let i = 0; i < lineIndices.length; i++) {
        board.unshift(new Array(10).fill(0));
      }
    }
  };


  // Getters

  let getBoard = () => {
    return board;
  };

  let getTetromino = () => {
    return tetromino;
  };

  let getScore = () => {
    return score;
  };

  let isGameOver = () => {
    return gameOver;
  };


  return {
    init: init,
    getTetromino: getTetromino,
    getBoard: getBoard,
    getScore: getScore,
    isGameOver: isGameOver,
    rotate: rotate,
    moveLeft: moveLeft,
    moveRight: moveRight,
    tic: tic,
    drop: drop,
    clearLines: clearLines,
    deleteLinesFromBoard: deleteLinesFromBoard
  };

})(TETRIS.TetMaker);
