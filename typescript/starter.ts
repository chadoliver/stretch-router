module starter {

    // cross browser way to add an event listener
    function addListener(event, obj, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(event, fn, false);   // modern browsers
        } else {
            obj.attachEvent("on" + event, fn);          // older versions of IE
        }
    }

    export var start = function(callback) {
        addListener('load', window, callback);
    }
}
