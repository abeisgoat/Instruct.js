/*global require, console, process*/
(function () {
    "use strict";

    var instruct, sayHello;

    instruct = require('./instruct.js')('https://brilliant-fire-67.firebaseio.com/');

    sayHello = instruct(function (message) {
        console.log("Say:", message);
    });

    if (process.argv.length >= 3) {
        setInterval(function () {
            sayHello(process.argv[2]);
        }, 1000);
    }
}());
