var TETRIS = TETRIS || {};

TETRIS.View = ( function() {
  'use strict';

  let canvas, ctx;


  // Receive callbacks passed from controller.

  let init = (callbacks) => {
    let startGame = callbacks.startGame;
    let rotate = callbacks.rotate;
    let moveLeft = callbacks.moveLeft;
    let moveRight = callbacks.moveRight;
    let moveDown = callbacks.moveDown;
    let drop = callbacks.drop;

    _setUpCanvas();

    _startButtonListener(startGame);
    _resetButtonListener();
    _keydownListener(rotate, moveLeft, moveRight, moveDown, drop);
  };


  // Board is 10x20, cells are 25x25 pixels.

  let _setUpCanvas = () => {
    canvas = document.getElementById('tetris-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 10 * 25;
    canvas.height = 20 * 25;
  };


  let _$resetButton = $('<button>').attr('id', 'reset-button')
                                   .text('Reset Game');


  let _startButtonListener = (startGame) => {
    $('#control-panel').on('click', '#start-button', function() {
      $(this).remove();
      $('#control-panel').append(_$resetButton);
      startGame();
    });
  };


  let _resetButtonListener = () => {
    $('#control-panel').on('click', '#reset-button', () => {
      location.reload();
    });
  };


  let _keydownListener = (rotate, moveLeft, moveRight, moveDown, drop) => {
    $(document).keydown( function(event) {
      switch(event.which) {
        // up
        case 38:
          rotate();
          break;
        // left
        case 37:
          moveLeft();
          break;
        // right
        case 39:
          moveRight();
          break;
        // down
        case 40:
          moveDown();
          break;
        // space
        case 32:
          drop();
      }
    });
  ;}


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


  // Board is multi-colored so fill color is set for each iteration.

  let _renderBoard = (board) => {

    // render block border
    board.forEach( function(row, y) {
      row.forEach( function(block, x) {
        if (block) {
          _setFillColor('w');
          ctx.fillRect(x * 25, y * 25, 25, 25);
        }
      })
    })

    // render block color
    board.forEach( function(row, y) {
      row.forEach( function(block, x) {
        if (block) {
          _setFillColor(block);
          ctx.fillRect(x * 25 + 1, y * 25 + 1, 23, 23);
        }
      })
    })
  };


  // Convenience method for setting fill color semantically.

  let _setFillColor = (color) => {
    let fillColor;
    switch(color) {
      case 'w':
        fillColor = '#EEEEEE';
        break;
      case 'r':
        fillColor = '#CF000F';
        break;
      case 'o':
        fillColor = '#F9690E';
        break;
      case 'y':
        fillColor = '#F5AB35';
        break;
      case 'g':
        fillColor = '#00B16A';
        break;
      case 'b':
        fillColor = '#19B5FE';
        break;
      case 'i':
        fillColor = '#663399';
        break;
      case 'v':
        fillColor = '#9A12B3';
    }
    ctx.fillStyle = fillColor;
  };


  let updateScore = (score) => {
    $('#score').text(score);
  };


  let gameOver = () => {
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.font = "22px 'Press Start 2P'";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over!', x, y);
  };


  let render = (tetromino, board) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render striped background
    ctx.fillStyle = '#DADFE1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#EEEEEE';
    for (let j = 1; j < 10; j += 2) {
      ctx.fillRect(j * 25, 0, 25, canvas.height);
    }

    // render game state
    _renderTetromino(tetromino);
    _renderBoard(board);
  };


  return {
    init: init,
    gameOver: gameOver,
    updateScore: updateScore,
    render: render
  };

})();
