(function () {

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this; 
    
    // Create a reference to this
    var Instructor = function (fString) {
        var self = this;
        
        self._fRef = new root.Firebase(fString);
        
        self._create = function (func, validators) {
            console.log('piepie', func.toString());
        }
        
        return self._create;
    };
    
    var setup = function (isNode) {
        if (isNode) {
            root.Firebase = require('firebase');
        }else{
            // Import script tag
        }
    };

    var isNode = false;

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
})();
