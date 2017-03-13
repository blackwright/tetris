var TETRIS = TETRIS || {};

driver = undefined;


TETRIS.Controller = ( function(Model, View) {
  'use strict';

  let clearedLineCount, acceptInput;


  // Initializes model and view, passing in callback functions.

  let init = () => {

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

  let _gameLoop = () => {
    Model.tic();
    _clearLines();
    render();
    if (Model.isGameOver()) {
      _gameOver();
    }
  };


  let _updateScore = () => {
    let score = Model.getScore();
    View.updateScore(score);
  };


  let _clearLines = () => {
    let lines = Model.clearLines();
    if (lines) {
      _updateScore();
      _updateLevel(lines);
    }
    Model.deleteLinesFromBoard(lines);
  };


  let _updateLevel = (lines) => {
    clearedLineCount += lines.length;
    let level = parseInt(clearedLineCount / 5);
    _updateGameSpeed(level);
    View.updateLevel(level);
  };


  let _updateGameSpeed = (level) => {
    clearInterval(driver);
    let intervalTime = 1000 - level * 50;
    driver = setInterval(_gameLoop, intervalTime);
  };


  // Game over state disables input, clears interval, and renders
  // a message in the view.

  let _gameOver = () => {
    acceptInput = false;
    clearInterval(driver);
    View.gameOver();
  };


  // Enables input on game start. Game loop set to global var "driver"
  // so that it can later be cleared.

  let startGame = () => {
    driver = setInterval(_gameLoop, 1000);
    acceptInput = true;
  };


  let resetGame = () => {
    clearInterval(driver);
    init();
  };


  // All movement checks if input is enabled before executing the move
  // and then rendering the view.

  let rotate = () => {
    if (acceptInput && Model.rotate()) render();
  };

  let moveLeft = () => {
    if (acceptInput && Model.moveLeft()) render();
  };

  let moveRight = () => {
    if (acceptInput && Model.moveRight()) render();
  };


  // Check for cleared lines on tic and instant drop.

  let moveDown = () => {
    if (acceptInput) {
      Model.tic();
      _clearLines();
      render();
    }
  };

  let drop = () => {
    if (acceptInput) {
      Model.drop();
      _clearLines();
      render();
    }
  };


  // Render method gets game state from model and passes them into the view.

  let render = () => {
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
