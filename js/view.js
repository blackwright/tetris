var TETRIS = TETRIS || {};

TETRIS.View = ( function() {
  'use strict';

  let canvas, ctx;


  // Receive callbacks passed from controller.

  let init = (callbacks) => {
    let startGame = callbacks.startGame;
    let moveLeft = callbacks.moveLeft;
    let moveRight = callbacks.moveRight;
    let moveDown = callbacks.moveDown;

    _setUpCanvas();


  };


  // Board is 10x20, cells are 25x25 pixels.

  let _setUpCanvas = () => {
    canvas = document.getElementById('tetris-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 10 * 25;
    canvas.height = 20 * 25;
  };


  // Tetrominoes are filled in one color, then again 1px smaller
  // for the appearance of a stroke.

  let _renderTetromino = (tetromino) => {

    // render tetromino border
    _setFillColor('w');
    let state = tetromino.getState();
    let location = tetromino.getLocation();
    state.forEach( function(row, stateY) {
      row.forEach( function(block, stateX) {
        if (block) {
          let y = location[0] + stateY;
          let x = location[1] + stateX;
          ctx.fillRect(x * 25, y * 25, 25, 25);
        }
      })
    })

    // render tetromino block color
    let color = tetromino.getColor();
    _setFillColor(color);
    state.forEach( function(row, stateY) {
      row.forEach( function(block, stateX) {
        if (block) {
          let y = location[0] + stateY;
          let x = location[1] + stateX;
          ctx.fillRect(x * 25 + 1, y * 25 + 1, 23, 23);
        }
      })
    })
  };


  return {
    init: init
  };

})();
