/*global console, require, module*/
(function () {
    "use strict";

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root, Instructor, setup, isNode;
    root = this;
    
    // Create a reference to this
    Instructor = function (fString) {
        var self = this;
        
        self.fRef = new root.Firebase(fString);
        
        self.create = function (func, validators) {
            console.log('piepie', func.toString());
        };
        
        return self.create;
    };
    
    setup = function (isNode) {
        if (isNode) {
            root.Firebase = require('firebase');
        } else if (!root.Firebase) {
            console.log("Please include Firebase.js");
        }
    };

    isNode = false;

    // Export the Instruce object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Instructor;
        isNode = true;
    } else {
        root.Instructor = Instructor;
    }
    setup(isNode);
}());
