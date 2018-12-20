import { pointIsIn } from './helper.js';


export class Search {
     constructor(currentState, goal, snakeCells) {
          this.currentState = currentState;
          this.goal = goal;
          this.snakeCells = snakeCells;
     }

     getActionsBFS(snake, currentState, goal, snakeCells) {
          console.log("start BFS");
          var Queue = [];
          var openList = [];
          var actions = []; // actions leading to each state 
          Queue.push([currentState, actions, snakeCells]); // currState, actions, snakeCells
          while (Queue.length > 0) {
               [currentState, actions, snakeCells] = Queue.shift();

               if (snake.isGoal(currentState, goal)) {
                    return actions;
               }
               if (pointIsIn(currentState, openList) == -1) {
                    openList.push(currentState) // visited!
                    var successors = snake.getSuccessors(currentState, snakeCells);
                    // console.log('State: ' + currentState.x + ' , ' + currentState.y + ' , ' + currentState.action);
                    successors.forEach(succ => {
                         // console.log('succ: ' + succ.x + ' , ' + succ.y + ' , ' + succ.action);
                         if (pointIsIn(succ, openList) == -1) {
                              var newState = succ;
                              var nextActions = actions.concat([succ.action]); 
                              var newSnakeCells = [{x: currentState.x, y: currentState.y}].concat(snakeCells);

                              // remove cells as we move away from them
                              if (newSnakeCells.length > snake.maxCells) {
                                   newSnakeCells.pop();
                              }
                              Queue.push([newState, nextActions, newSnakeCells]);
                         }
                    });
               }
          }
          return [];

     }
     getActionsDFS(snake, currentState, goal, snakeCells){
          console.log("start DFS");
          var Stack = [];
          var openList = []; // Open List
          var actions = []; // actions to get to each state
          Stack.push([currentState, actions , snakeCells]); // currState, actions, snakeCells

          // if (snake.getSuccessors(currentState).length <= 2) // TODO solve first state problem
          while (Stack.length > 0) {
               [currentState, actions, snakeCells] = Stack.pop();

               if (snake.isGoal(currentState, goal)) {
                    return actions;
               }
               if (pointIsIn(currentState, openList) == -1) {
                    openList.push(currentState) // visited!
                    var successors = snake.getSuccessors(currentState, snakeCells);
                    // console.log('State: ' + currentState.x + ' , ' + currentState.y + ' , ' + currentState.action);
                    successors.forEach(succ => {
                         // console.log('succ: ' + succ.x + ' , ' + succ.y + ' , ' + succ.action);
                         if (pointIsIn(succ, openList) == -1) {
                              var newState = succ;
                              var nextActions = actions.concat([succ.action]); 
                              var newSnakeCells = [{x: currentState.x, y: currentState.y}].concat(snakeCells);

                              if (newSnakeCells.length > snake.maxCells) {
                                   newSnakeCells.pop();
                              }
                              Stack.push([newState, nextActions, newSnakeCells]);
                         }
                    });
               }
          }
          console.log('no goal found!');
          return [];
     }
}

// function pointIsIn(point, array) {
//      var idx = -1; // Not Found
//      for (let i = 0; i < array.length; i++) {
//           if (array[i].x == point.x && array[i].y == point.y ) {
//                idx = i;
//                break;
//           }
//      }
//      return idx;
// }