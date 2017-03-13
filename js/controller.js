var TETRIS = TETRIS || {};

var driver;

TETRIS.Controller = ( function(Model, View) {
  'use strict';

  // Input is disabled until the game starts.

  let acceptInput = false;


  // Initializes model and view, passing in callback functions.

  let init = () => {
    Model.init();

    View.init({
      startGame: startGame,
      rotate: rotate,
      moveLeft: moveLeft,
      moveRight: moveRight,
      moveDown: moveDown,
      drop: drop
    });

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


  let _clearLines = () => {
    let lines = Model.clearLines();
    if (lines) updateScore();
    Model.deleteLinesFromBoard(lines);
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


  let updateScore = () => {
    let score = Model.getScore();
    View.updateScore(score);
  };


  // Render method gets game state from model and passes them into the view.

  let render = () => {
    let tetromino = Model.getTetromino();
    let board = Model.getBoard();
    View.render(tetromino, board);
  };


  return {
    init: init
  };

})(TETRIS.Model, TETRIS.View);




$(document).ready( () => {
  TETRIS.Controller.init();
})
