var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
import { Snake }  from './snake.js';
import { getRandomInt } from './helper.js';
var grid = 16;
var fbsController = 0;

var apple = {
     x: getRandomInt(0,25) * grid,
     y: getRandomInt(0,25) * grid
};

// game loop
function loop() {
     requestAnimationFrame(loop);

     // controlling FBS; 1 = 60 fbs, 2 = 30 fbs, 4 = 15 fbs
     // 4: only show animation loop once each 4 counts instead of 1 count
     if (++fbsController < 1) {
          return;
     }

     fbsController = 0;
     context.clearRect(0, 0, canvas.width, canvas.height);

     // move Snake by it's velocity
     Snake.x += Snake.dx;
     Snake.y += Snake.dy;

     // Wall collision
     if (Snake.x < 0 || Snake.x >= canvas.width
          || Snake.y < 0 || Snake.y >= canvas.height) {
          restartGame(Snake, apple)
     }

     // cells occupied by Snake
     Snake.cells.unshift({x: Snake.x, y: Snake.y});
     if (Snake.cells.length > Snake.maxCells) {
          Snake.cells.pop();
     }

     // apple rect
     context.fillStyle = 'green';
     context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

     // Snake rectS
     context.fillStyle = 'white';
     Snake.cells.forEach(function (cell, index) {
               // seperate grids by 1px
               context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

               // apple pos == Snake head
               Snake.isGoal(Snake.getHead(), apple);

               // check current cell with all NEXT cells O(n^2)
               for (var i = index + 1; i < Snake.cells.length; i++) {
                    // Snake self-collision
                    if (cell.x === Snake.cells[i].x && cell.y === Snake.cells[i].y) {
                         restartGame(Snake, apple);
                    }
               }
          });

          Snake.executeNextAction(Snake.getHead(), apple, Snake.getState(), 'BFS');
}

function restartGame(Snake, apple) {
     console.log('Died!');
     Snake.x = 160;
     Snake.y = 160;
     Snake.cells = [];
     Snake.maxCells = 4;
     Snake.dx = grid;
     Snake.dy = 0;
     Snake.actionList = [] // remove unrelated actions (previous actions before death)

     apple.x = getRandomInt(0, 25) * grid;
     apple.y = getRandomInt(0, 25) * grid;
}

requestAnimationFrame(loop);

document.addEventListener('keydown', function(e) {
     //left arrow key
     if (e.which === 37 && Snake.dx === 0) {
          Snake.dx = -grid;
          Snake.dy = 0;
     }
     // up arrow key
     else if (e.which === 38 && Snake.dy === 0) {
          Snake.dx = 0;
          Snake.dy = -grid;
     }
     // right arrow key
     else if (e.which === 39 && Snake.dx === 0) {
          Snake.dx = grid;
          Snake.dy = 0;
     }
     // down arrow key
     else if (e.which === 40 && Snake.dy === 0) {
          Snake.dx = 0;
          Snake.dy = grid;
     }
});