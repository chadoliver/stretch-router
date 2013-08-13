angular.module('utils', []).factory('utils', function() {
    
    return {
        randomInt : function(min, max) {
            if (max === undefined) {
                // This ensures that randomInt(42) is equivalent to randomInt(0,42)
                max = min;
                min = 0;
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        colors : {
            normal : 'grey',
            hover : 'red',
            selected : 'blue',
            random : function() {
                return 'rgb(' + this.randomInt(255) + ',' + this.randomInt(255) + ',' + this.randomInt(255) + ')';
            },
        },
    }
});
