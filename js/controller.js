var TETRIS = TETRIS || {};

tetDriver = undefined;


TETRIS.Controller = ( (Model, View) => {
  'use strict';

  let clearedLineCount, acceptInput;


  // Initializes model and view, passing in callback functions.

  const init = () => {

    clearedLineCount = 0;

    // input disabled until the game starts
    acceptInput = false;

    Model.init();

    View.init({
      startGame: startGame,
      rotate: rotate,
      moveLeft: moveLeft,
      moveRight: moveRight,
      moveDown: moveDown,
      drop: drop,
      resetGame: resetGame
    });

    _updateScore();
    View.updateLevel(0);
    render();
  }


  // Game loop tics the tetromino downward, clears lines if needed,
  // renders, then checks for game over.

  const _gameLoop = () => {
    Model.tic();
    _clearLines();
    if (Model.isGameOver()) _gameOver();
  };


  const _updateScore = () => {
    let score = Model.getScore();
    View.updateScore(score);
  };


  const _pauseGame = () => {
    acceptInput = false;
    clearInterval(tetDriver);
  };


  const _flashLines = (lines) => {
    _pauseGame();
    let board = Model.getBoard();
    View.hideLines(lines);
    setTimeout( () => {
      View.showLines(lines, board);
      setTimeout( () => {
        View.hideLines(lines);
        setTimeout( () => {
          View.showLines(lines, board);
          setTimeout( () => {
            Model.deleteLinesFromBoard(lines);
            render();
            startGame();
          }, 160);
        }, 160);
      }, 160);
    }, 160);
  };


  const _clearLines = () => {
    render();
    let lines = Model.clearLines();
    if (lines) {
      _updateScore();
      _updateLevel(lines);
      _flashLines(lines);
    } else {
      if (!Model.isGameOver()) render();
    }
  };


  const _updateLevel = (lines) => {
    clearedLineCount += lines.length;
    let level = _getLevel();
    _updateGameSpeed(level);
    View.updateLevel(level);
  };


  const _getLevel = () => {
    return parseInt(clearedLineCount / 5);
  };


  const _updateGameSpeed = (level) => {
    clearInterval(tetDriver);
    let intervalTime = 1000 - level * 50;
    tetDriver = setInterval(_gameLoop, intervalTime);
  };


  // Game over state disables input, clears interval, and renders
  // a message in the view.

  const _gameOver = () => {
    _pauseGame();
    View.gameOver();
  };


  // Enables input on game start. Interval set to global var "tetDriver"
  // so that it can later be cleared.

  const startGame = () => {
    let intervalTime = 1000 - _getLevel() * 50;
    tetDriver = setInterval(_gameLoop, intervalTime);
    acceptInput = true;
  };


  const resetGame = () => {
    clearInterval(tetDriver);
    init();
  };


  // All movement checks if input is enabled before executing the move
  // and then rendering the view.

  const rotate = () => {
    if (acceptInput && Model.rotate()) render();
  };

  const moveLeft = () => {
    if (acceptInput && Model.moveLeft()) render();
  };

  const moveRight = () => {
    if (acceptInput && Model.moveRight()) render();
  };


  // Check for cleared lines on tic and instant drop.

  const moveDown = () => {
    if (acceptInput && !Model.isGameOver()) {
      Model.tic();
      _clearLines();
    }
  };

  const drop = () => {
    if (acceptInput) {
      Model.drop();
      _clearLines();
    }
  };


  // Render method gets game state from model and passes them into the view.

  const render = () => {
    let nextTetromino = Model.getNextTetromino();
    let tetromino = Model.getTetromino();
    let board = Model.getBoard();
    View.render(nextTetromino, tetromino, board);
  };


  return {
    init: init
  };

})(TETRIS.Model, TETRIS.View);




$(document).ready( () => {
  TETRIS.Controller.init();
})
