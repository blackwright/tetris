var TETRIS = TETRIS || {};

TETRIS.TetMaker = ( function() {
  'use strict';

  let _colors = ['r', 'o', 'y', 'g', 'b', 'i', 'v'];

  // Tetromino rotation states are hardcoded here. Their location on the board
  // is determined by the first (top-left) element in the 2-d array.

  let _types = [ {name: 'I',
                  states: [
                           [[0, 0, 0, 0],
                            [1, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0]],

                           [[0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0]],

                           [[0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [1, 1, 1, 1],
                            [0, 0, 0, 0]],

                           [[0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0]]
                          ]},

                 {name: 'J',
                  states: [
                           [[1, 0, 0],
                            [1, 1, 1],
                            [0, 0, 0]],

                           [[0, 1, 1],
                            [0, 1, 0],
                            [0, 1, 0]],

                           [[0, 0, 0],
                            [1, 1, 1],
                            [0, 0, 1]],

                           [[0, 1, 0],
                            [0, 1, 0],
                            [1, 1, 0]]
                          ]},

                 {name: 'L',
                  states: [
                           [[0, 0, 1],
                            [1, 1, 1],
                            [0, 0, 0]],

                           [[0, 1, 0],
                            [0, 1, 0],
                            [0, 1, 1]],

                           [[0, 0, 0],
                            [1, 1, 1],
                            [1, 0, 0]],

                           [[1, 1, 0],
                            [0, 1, 0],
                            [0, 1, 0]]
                          ]},

                 {name: 'O',
                  states: [
                           [[0, 1, 1],
                            [0, 1, 1]],

                           [[0, 1, 1],
                            [0, 1, 1]],

                           [[0, 1, 1],
                            [0, 1, 1]],

                           [[0, 1, 1],
                            [0, 1, 1]],
                          ]},

                 {name: 'S',
                  states: [
                           [[0, 1, 1],
                            [1, 1, 0],
                            [0, 0, 0]],

                           [[0, 1, 0],
                            [0, 1, 1],
                            [0, 0, 1]],

                           [[0, 0, 0],
                            [0, 1, 1],
                            [1, 1, 0]],

                           [[1, 0, 0],
                            [1, 1, 0],
                            [0, 1, 0]]
                          ]},

                 {name: 'T',
                  states: [
                           [[0, 1, 0],
                            [1, 1, 1],
                            [0, 0, 0]],

                           [[0, 1, 0],
                            [0, 1, 1],
                            [0, 1, 0]],

                           [[0, 0, 0],
                            [1, 1, 1],
                            [0, 1, 0]],

                           [[0, 1, 0],
                            [1, 1, 0],
                            [0, 1, 0]]
                          ]},

                 {name: 'Z',
                  states: [
                           [[1, 1, 0],
                            [0, 1, 1],
                            [0, 0, 0]],

                           [[0, 0, 1],
                            [0, 1, 1],
                            [0, 1, 0]],

                           [[0, 0, 0],
                            [1, 1, 0],
                            [0, 1, 1]],

                           [[0, 1, 0],
                            [1, 1, 0],
                            [1, 0, 0]]
                          ]}
               ]



  // Tetroclone constructor produces tetroclones that have all the
  // properties and methods of true tetrominoes, except those for getting
  // and setting color.

  function Tetroclone(type, stateIndex, location) {
    this._type = type;
    this._stateIndex = stateIndex;
    this.location = location;

    this.rotate = function() {
      this._stateIndex--;
      if (this._stateIndex < 0) this._stateIndex = 3;
    };

    this.getState = function() {
      return this._type.states[this._stateIndex];
    };

    this.getLocation = function() {
      return this.location;
    }

    this.moveLeft = function() {
      this.location[1]--;
    };

    this.moveRight = function() {
      this.location[1]++;
    };

    this.tic = function() {
      this.location[0]++;
    };
  }



  // Tetrominoes can clone themselves with their current type, rotation
  // state, and location. This clone is used to check for potential
  // collisions and out of bounds state.

  function Tetromino(stateIndex = 0, location = [0, 3]) {
    Tetroclone.call(this, _getRandomType(), stateIndex, location);
    this.color = _getRandomColor();

    this.getColor = function() {
      return this.color;
    };

    this.clone = function() {
      let type = this._type;
      let stateIndex = this._stateIndex;
      let location = this.location.slice(0);
      return new Tetroclone(type, stateIndex, location);
    };
  }



  // Tetromino/Tetroclone prototypal relationship

  Tetromino.prototype = Object.create(Tetroclone.prototype);
  Tetromino.constructor = Tetromino;



  return {
    Tetroclone: Tetroclone,
    Tetromino: Tetromino
  };

})();