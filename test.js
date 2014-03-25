/*global require, console, process*/
(function () {
    "use strict";

    var instruct, sayHello;

    instruct = require('./instruct.js')('https://brilliant-fire-67.firebaseio.com/');

    sayHello = instruct('cracka', function (message) {
        console.log("Say:", message);
    }, {
        message: function (message) {
            return typeof message == 'string';
        }
    });

    if (process.argv.length >= 3) {
        setInterval(function () {
            sayHello(process.argv[2]);
        }, 1000);
    }
}());
