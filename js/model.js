var TETRIS = TETRIS || {};

TETRIS.Model = ( function(TetMaker) {
  'use strict';

  let board, tetromino;
  let score = 0;
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



  // All movement and rotation is checked for validity by cloning the
  // tetromino, performing the movement with the tetroclone, then checking for
  // collision or out of bounds on the clone.

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
    moveLeft: moveLeft,
    moveRight: moveRight,
    tic: tic
  };

})(TETRIS.TetMaker);
