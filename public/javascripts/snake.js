var grid = 16;
var canvas = document.getElementById('game');
import { Search } from './search.js'; 
import { pointIsIn, getRandomInt } from './helper.js';

export var Snake = { // AI Agent
     x: 144,
     y: 144,

     // snake first movement direction
     dx: grid,
     dy: 0,

     // snake body
     cells: [],

     // initial body is 4 cells 
     maxCells: 4,

     // Action sequence to be executed (moves)
     actionList: [],
     applesEaten: 0,

     // Get the next action to execute 
     // Action sequence starts from 0
     executeNextAction(currentState, goal, snakeCells, Algorithm) {  
          if (this.actionList.length <= 0 || typeof this.actionList == 'undefined') {
               if (Algorithm == 'BFS') {
                    var search = new Search(currentState, goal, snakeCells);
                    this.actionList = search.getActionsBFS(this, currentState, goal, snakeCells);
               } else if (Algorithm == 'DFS') {
                    var search = new Search(currentState, goal, snakeCells);
                    this.actionList = search.getActionsDFS(this, currentState, goal, snakeCells);
               } else if (Algorithm == 'PLAYER') {
                    return [];
               } else {
                    this.actionList = ['down','down','down','down','down','down','right',
                                       'right','right','right','right','down','left']
               }
               this.executeNextAction();
          } else {
               var nextAction = this.actionList[0]
               this.actionList.shift();
               this.takeAction(nextAction);
          }
     },
     getActionsBFS(currentState, goal, snakeCells) {
          // console.log("start BFS");
          var Queue = [];
          var openList = [];
          var actions = []; // actions leading to each state 
          Queue.push([currentState, actions, snakeCells]); // currState, actions, snakeCells
          while (Queue.length > 0) {
               [currentState, actions, snakeCells] = Queue.shift();

               if (this.isGoal(currentState, goal)) {
                    return actions;
               }
               if (pointIsIn(currentState, openList) == -1) {
                    openList.push(currentState) // visited!
                    var successors = this.getSuccessors(currentState, snakeCells);
                    // console.log('State: ' + currentState.x + ' , ' + currentState.y + ' , ' + currentState.action);
                    successors.forEach(succ => {
                         // console.log('succ: ' + succ.x + ' , ' + succ.y + ' , ' + succ.action);
                         if (pointIsIn(succ, openList) == -1) {
                              var newState = succ;
                              var nextActions = actions.concat([succ.action]); 
                              var newSnakeCells = [{x: currentState.x, y: currentState.y}].concat(snakeCells);

                              // remove cells as we move away from them
                              if (newSnakeCells.length > this.maxCells) {
                                   newSnakeCells.pop();
                              }
                              Queue.push([newState, nextActions, newSnakeCells]);
                         }
                    });
               }
          }
          return [];

     },
     getActionsDFS(currentState, goal, snakeCells){
          // console.log("start DFS");
          var Stack = [];
          var openList = []; // Open List
          var actions = []; // actions to get to each state
          Stack.push([currentState, actions , snakeCells]); // currState, actions, snakeCells

          // if (this.getSuccessors(currentState).length <= 2) // TODO solve first state problem
          while (Stack.length > 0) {
               [currentState, actions, snakeCells] = Stack.pop();

               if (this.isGoal(currentState, goal)) {
                    return actions;
               }
               if (pointIsIn(currentState, openList) == -1) {
                    openList.push(currentState) // visited!
                    var successors = this.getSuccessors(currentState, snakeCells);
                    // console.log('State: ' + currentState.x + ' , ' + currentState.y + ' , ' + currentState.action);
                    successors.forEach(succ => {
                         // console.log('succ: ' + succ.x + ' , ' + succ.y + ' , ' + succ.action);
                         if (pointIsIn(succ, openList) == -1) {
                              var newState = succ;
                              var nextActions = actions.concat([succ.action]); 
                              var newSnakeCells = [{x: currentState.x, y: currentState.y}].concat(snakeCells);

                              if (newSnakeCells.length > this.maxCells) {
                                   newSnakeCells.pop();
                              }
                              Stack.push([newState, nextActions, newSnakeCells]);
                         }
                    });
               }
          }
          // console.log('no goal found!');
          return [];
     },

     takeAction(action) { // actions are executed from the head of the actionlist
          if (action == 'left') {
               this.dx = -grid;
               this.dy = 0;
          }
          // up arrow key
          else if (action == 'up') {
               this.dx = 0;
               this.dy = -grid;
          }
          // right arrow key
          else if (action == 'right') {
               this.dx = grid;
               this.dy = 0;
          }
          // down arrow key
          else if (action == 'down') {
               this.dx = 0;
               this.dy = grid;
          }
     },

     // State is where the this resides at the grid; this's body 
     getState() { 
          return this.cells;
     },

     getHead() {
          var action = '';
          if (this.dx < 0 && this.dy == 0) {
               action = 'left';
          } else if (this.dx == 0 && this.dy < 0) {
               action = 'up';
          } else if (this.dx > 0 && this.dy == 0) {
               action = 'right';
          } else if (this.dx == 0 && this.dy > 0) {
               action = 'down';
          }
          return {x:this.x, y:this.y, action: action};
     },

     // get nieghboring positions from the current state
     getSuccessors(state, snakeCells) { 
          var x = state.x;
          var y = state.y;
          var stateAction = state.action;
          var successors = [
               {x:x + grid,y:y, action: 'right'},
               {x:x,y:y - grid, action: 'up'}, 
               {x:x - grid,y:y, action: 'left'}, 
               {x:x,y:y + grid, action: 'down'}
          ];

          // remove opposite movement or outside boundary or snake will collide by iteself
          var idx0 = pointIsIn({x:x - grid,y:y}, snakeCells);
          if (stateAction == 'right' || x - grid < 0 || idx0 != -1 ){ 
               var idxSucc = pointIsIn({x:x - grid,y:y}, successors);
               successors.splice(idxSucc, 1); 
          } 

          var idx1 = pointIsIn({x:x,y:y + grid}, snakeCells);
          if (stateAction == 'up' || y + grid >= canvas.height || idx1 != -1){ 
               var idxSucc = pointIsIn({x:x,y:y + grid}, successors);
               successors.splice(idxSucc, 1);  
          }

          var idx2 = pointIsIn({x:x + grid,y:y}, snakeCells);
          if (stateAction == 'left' || x + grid >= canvas.width || idx2 != -1 ){ 
               var idxSucc = pointIsIn({x:x + grid,y:y}, successors);
               successors.splice(idxSucc, 1); 
          }

          var idx3 = pointIsIn({x:x,y:y - grid}, snakeCells);
          if (stateAction == 'down' || y - grid < 0 || idx3 != -1){
               var idxSucc = pointIsIn({x:x,y:y - grid}, successors);
               successors.splice(idxSucc, 1); 
          }

          return successors; 
     },

     isGoal(state, apple) {        
          var isGoal = state.x === apple.x && state.y === apple.y;
          if (isGoal) {
               if (this.x === apple.x && this.y === apple.y) { // Reality! not thinking (Algorithm)
                    this.maxCells++;
                    // 25x25 grids = canvas size
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 25) * grid;
                    this.applesEaten++;
                    console.log('Apples: ' + this.applesEaten);
                    document.getElementById('score').innerHTML = 'Score: ' + this.applesEaten;
               }
          }
          return isGoal;
     }
};