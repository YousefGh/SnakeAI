export function isInArray(element, array) {
     isInArray = false;
     for (let i = 0; i < array.length ; i++) {
          if (array[i] == element) {
               isInArray = true;
               break;
          }
     }
     return isInArray;
}

export function pointIsIn(point, array) {
     var idx = -1; // Not Found
     for (let i = 0; i < array.length; i++) {
          if (array[i].x == point.x && array[i].y == point.y ) {
               idx = i;
               break;
          }
     }
     return idx;
}

export function getRandomInt(min, max) {
     return Math.floor(Math.random() * (max - min)) + min;
}