var instruct = require('./instruct.js')('https://brilliant-fire-67.firebaseio.com/');

var local_SayHello = function (message) {
  console.log(message);    
};

var SayHello = instruct(local_SayHello);
