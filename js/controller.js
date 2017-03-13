var TETRIS = TETRIS || {};

TETRIS.Controller = ( function(Model, View) {
  'use strict';

  let acceptInput = false;

  let init = () => {
    Model.init();
    View.init({});

    render();
  }

  let render = () => {

  };

  return {
    init: init
  }

})(TETRIS.Model, TETRIS.View);




$(document).ready( () => {
  TETRIS.Controller.init();
})
