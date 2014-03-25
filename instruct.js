/*global console, require, module*/
(function () {
    "use strict";

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root, Instructor, setup, construct, isNode;
    root = this || {};
    
    // Create a reference to this
    Instructor = function (fString) {
        var self = this || {};
        
        // Create a "global" fRef so we can call push
        self.writeRef = new root.Firebase(fString);
        // Then set the real fRef as a queried version of the temp
        // This magic will ensure we only receive updates from this
        // point in time on and not any old entries in the list
        self.readRef = self.writeRef.startAt(null, self.writeRef.push().name());
        
        // Store funcs with keys as SHA1 hashes of func.toString()
        self.funcs = {};

        //Makes a new interaction
        self.add = function (func, validators) {
            var funcKey = self.getFuncKey(func);
            self.funcs[funcKey] = func;
            return self.wrap(funcKey);
        };

        // Remove a function from known functions
        self.remove = function (funcId) {
            var funcKey = self.getFuncKey(funcId);
            delete self.funcs[funcKey];
        };

        // We're up all night, to get funckey
        self.getFuncKey = function (funcId) {
            if (typeof funcId === "function") {
                return root.SHA1(funcId.toString());
            } else if (typeof funcId === "string") {
                return funcId;
            } else {
                throw 'Unknown funcId type: ' + (typeof funcId);
            }
        };

        // Wrap our actual function with one which sends call to Firebase
        self.wrap = function (funcKey) {
            return function () {
                self.writeRef.push({fk: funcKey, a: arguments});
            };
        };

        // Call a func from funcKey and the list of args
        self.callFunc = function (funcKey, args) {
            if (self.funcs[funcKey]) {
                self.funcs[funcKey].apply(undefined, args);
            } else {
                throw 'Unknown Function Key Called: ' + funcKey;
            }
        };
        
        // Watch incoming func calls to call on our side
        self.readRef.on("child_added", function (snapshot) {
            var funcKey, args;
            funcKey = snapshot.val().fk;
            args = snapshot.val().a;
            self.callFunc(funcKey, args);
        });

        return self.add;
    };
    
    setup = function (isNode) {
        if (isNode) {
            root.Firebase = require('firebase');
            root.SHA1 = require('sha1');
        } else if (!root.Firebase) {
            console.log("Please include Firebase.js");
        }
    };

    construct = function () {
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
    };

    construct();
}());
