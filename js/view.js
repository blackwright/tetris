var TETRIS = TETRIS || {};

TETRIS.View = ( function() {
  'use strict';

  let nextCanvas, nextCtx, tetrisCanvas, tetrisCtx;


  // Receive callbacks passed from controller.

  let init = (callbacks) => {
    let startGame = callbacks.startGame;
    let rotate = callbacks.rotate;
    let moveLeft = callbacks.moveLeft;
    let moveRight = callbacks.moveRight;
    let moveDown = callbacks.moveDown;
    let drop = callbacks.drop;
    let resetGame = callbacks.resetGame;

    _setUpNextCanvas();
    _setUpTetrisCanvas();

    _startButtonListener(startGame);
    _resetButtonListener(resetGame);
    _keydownListener(rotate, moveLeft, moveRight, moveDown, drop);
  };


  let _setUpNextCanvas = () => {
    nextCanvas = document.getElementById('next-canvas');
    nextCtx = nextCanvas.getContext('2d');
    nextCanvas.width = 5 * 25;
    nextCanvas.height = 4 * 25;
  };


  // Board is 10x20, cells are 25x25 pixels.

  let _setUpTetrisCanvas = () => {
    tetrisCanvas = document.getElementById('tetris-canvas');
    tetrisCtx = tetrisCanvas.getContext('2d');
    tetrisCanvas.width = 10 * 25;
    tetrisCanvas.height = 20 * 25;
  };


  let _$startButton = $('<button>').attr('id', 'start-button')
                                   .text('Start Game');


  let _$resetButton = $('<button>').attr('id', 'reset-button')
                                   .text('Reset Game');


  // Attach button event handler with 'one' - this unbinds the handler after
  // first click so we don't have to manually remove it on reset.
  // Otherwise, the handlers would stack and cause duplication.

  let _startButtonListener = (startGame) => {
    $('#control-panel').one('click', '#start-button', () => {
      $('#control-panel').empty()
                         .append(_$resetButton);
      startGame();
    });
  };


  let _resetButtonListener = (resetGame) => {
    $('#control-panel').one('click', '#reset-button', () => {
      $('#control-panel').empty()
                         .append(_$startButton);

      // remove keydown listener on reset so they don't stack
      $(document).off();
      resetGame();
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

  let _renderNext = (nextTetromino) => {
    nextCtx.fillStyle = '#DADFE1';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    // offset is used to center the piece in next-canvas,
    // 'I' and 'O' pieces are special cases
    let xOffset = 25;
    let yOffset = 25;
    if (nextTetromino.getType() === 'I') {
      xOffset = 12;
      yOffset = 12;
    } else if (nextTetromino.getType() === 'O') {
      xOffset = 12;
      yOffset = 25;
    }

    // render tetromino border
    _setFillColor(nextCtx, 'w');
    let state = nextTetromino.getState();
    state.forEach( function(row, y) {
      row.forEach( function(block, x) {
        if (block) {
          nextCtx.fillRect(x * 25 + xOffset,
                           y * yOffset + 25,
                           25, 25);
        }
      })
    })

    // render tetromino block color
    let color = nextTetromino.getColor();
    _setFillColor(nextCtx, color);
    state.forEach( function(row, y) {
      row.forEach( function(block, x) {
        if (block) {
          nextCtx.fillRect(x * 25 + xOffset + 1,
                           y * 25 + yOffset + 1,
                           23, 23);
        }
      })
    })
  };


  let _renderTetromino = (tetromino) => {

    // render tetromino border
    _setFillColor(tetrisCtx, 'w');
    let state = tetromino.getState();
    let location = tetromino.getLocation();
    state.forEach( function(row, stateY) {
      row.forEach( function(block, stateX) {
        if (block) {
          let y = location[0] + stateY;
          let x = location[1] + stateX;
          tetrisCtx.fillRect(x * 25,
                             y * 25,
                             25, 25);
        }
      })
    })

    // render tetromino block color
    let color = tetromino.getColor();
    _setFillColor(tetrisCtx, color);
    state.forEach( function(row, stateY) {
      row.forEach( function(block, stateX) {
        if (block) {
          let y = location[0] + stateY;
          let x = location[1] + stateX;
          tetrisCtx.fillRect(x * 25 + 1,
                             y * 25 + 1,
                             23, 23);
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
          _setFillColor(tetrisCtx, 'w');
          tetrisCtx.fillRect(x * 25,
                             y * 25,
                             25, 25);
        }
      })
    })

    // render block color
    board.forEach( function(row, y) {
      row.forEach( function(block, x) {
        if (block) {
          _setFillColor(tetrisCtx, block);
          tetrisCtx.fillRect(x * 25 + 1,
                             y * 25 + 1,
                             23, 23);
        }
      })
    })
  };


  // Convenience method for setting fill color semantically.

  let _setFillColor = (ctx, color) => {
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


  let updateLevel = (level) => {
    $('#level').text(level + 1);
  };


  let gameOver = () => {
    let x = tetrisCanvas.width / 2;
    let y = tetrisCanvas.height / 2;
    tetrisCtx.font = "22px 'Press Start 2P'";
    tetrisCtx.textAlign = 'center';
    tetrisCtx.fillStyle = 'black';
    tetrisCtx.fillText('Game Over!', x, y);
  };


  let render = (nextTetromino, tetromino, board) => {
    tetrisCtx.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);

    // render striped background
    tetrisCtx.fillStyle = '#DADFE1';
    tetrisCtx.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    tetrisCtx.fillStyle = '#EEE';
    for (let j = 1; j < 10; j += 2) {
      tetrisCtx.fillRect(j * 25, 0, 25, tetrisCanvas.height);
    }

    // render game state
    _renderNext(nextTetromino);
    _renderTetromino(tetromino);
    _renderBoard(board);
  };


  return {
    init: init,
    gameOver: gameOver,
    updateScore: updateScore,
    updateLevel: updateLevel,
    render: render
  };

})();
