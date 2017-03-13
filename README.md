# [tetris](https://blackwright.github.io/tetris/index.html)

The classic game implemented with JavaScript and HTML5 canvas. [Play it here.](https://blackwright.github.io/tetris/index.html)

Use your arrow keys to move/rotate and hit space to drop down.

![Screenshot](https://github.com/blackwright/tetris/blob/master/screenshots/tetris1.jpg?raw=true)

### Gameplay Details

- Level increases for every 5 lines cleared.
- Game speed increases with level.
- Next tetromino is displayed on screen.
- Clear 4 lines (tetris!) for a score bonus.
- Get consecutive tetrises for a larger bonus.

![Screenshot](https://github.com/blackwright/tetris/blob/master/screenshots/tetris2.jpg?raw=true)

### Technical Notes

- JavaScript structured with revealing modules in MVC style.
- Collision checks performed by copying the tetromino object into a prototype "clone.""
- Event handlers attached with jQuery.
- Reset button restarts the game without reloading page.
