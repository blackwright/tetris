var TETRIS = TETRIS || {};

TETRIS.TetMaker = ( () => {
  'use strict';

  const _colors = ['r', 'o', 'y', 'g', 'b', 'i', 'v'];

  // Tetromino rotation states are hardcoded here. Their location on the board
  // is determined by the first (top-left) element in the 2-d array.

  const _types = [ {name: 'I',
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


  // Helpers for tetromino randomization.

  const _getRandomColor = () => {
    let index = Math.floor(Math.random() * _colors.length);
    return _colors[index];
  };

  const _getRandomType = () => {
    let index = Math.floor(Math.random() * _types.length);
    return _types[index];
  };


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
  // The default argument for location is the spawn location.

  function Tetromino(stateIndex = 0, location = [0, 3]) {
    Tetroclone.call(this, _getRandomType(), stateIndex, location);
    this.color = _getRandomColor();

    this.getType = () => {
      return this._type.name;
    };

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
