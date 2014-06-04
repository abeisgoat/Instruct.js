/*global console, require, module*/
(function () {
    "use strict";

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root, Instructor, setup, construct, isNode;
    root = typeof window !== 'undefined'? window:{};

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
        self.instruct = function (funcId, funcOrValidators, validators) {
            var funcKey = self.getFuncKey(funcId);

            if (typeof funcid === 'function') {
                self.funcs[funcKey] = {func: funcId};
            } else if (typeof funcOrValidators === 'function') {
                self.funcs[funcKey] = {func: funcOrValidators};
            } else if (typeof funcOrValidators === 'object') {
                validators = funcOrValidators;
            }

            if (self.funcs[funcKey]) {
                self.funcs[funcKey].validators = validators;
            }

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
                return root.md5(funcId.toString());
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
            var isValid = self.validateArgs(self.funcs[funcKey], args);

            if (self.funcs[funcKey] && isValid) {
                self.funcs[funcKey].func.apply(undefined, args);
            } else if (self.funcs[funcKey] && !isValid) {
                throw 'Argument Validation Failed!';
            } else {
                throw 'Unknown Function Key Called: ' + funcKey;
            }
        };

        // Get a hash of arguments index -> friendly name for arguments
        self.getArgNames = function (func) {
            var args = func.toString().match(/function \((.+)\)/)[1].split(',');
            var names = {};
            for (var a=0; a<args.length; a++) {
                names[a] = args[a].trim();
            }
            return names;
        };

        // Validate incoming arguments against validation functions
        self.validateArgs = function (funcData, args) {
            if (!funcData) return false;
            if (!funcData.validators) return true;
            if (!args.length) return false;

            var isValid = true;
            var argNames = self.getArgNames(funcData.func);
            var validators = funcData.validators;

            for (var a=0; (a<args.length && isValid); a++) { 
                var validator = validators[argNames[a]];
                if (validators) {
                    isValid = validator(args[a]) && isValid;
                } else {
                    isValid = false;
                }
            }

            return isValid;
        };

        // Watch incoming func calls to call on our side
        self.readRef.on("child_added", function (snapshot) {
            var funcKey, args;
            funcKey = snapshot.val().fk;
            args = snapshot.val().a;
            self.callFunc(funcKey, args);
        });
        
        return self.instruct;
    };

    // Export the Instruce object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Instructor;
        isNode = true;
        root.Firebase = require('firebase');
        root.md5 = require('blueimp-md5');
    } else {
        if (!root.Firebase) {
            throw "Please include Firebase.js";
        }
        (function () {
            // @@md5
        }).call(window);
        root.Instructor = Instructor;
    }
}());
