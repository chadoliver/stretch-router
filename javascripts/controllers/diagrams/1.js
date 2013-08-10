var frontpage = angular.module('diagram1', []);

frontpage.controller('diagram1Controller', function ($scope) {

    var Obstacle = function(x, y, radius) {
        this.pad = two.makeCircle(x, y, radius);
        this.keepout = two.makeCircle(x, y, radius+20);
        this.keepout.opacity = 0.5;
        this.keepout.noFill();
    };
    
    console.log('fooo');
    
    var viewport = {
        x: 688,
        y: 300,
    };
    
    var container = document.getElementById("container");
    var two = new Two({ 
        fullscreen: false,
        width: viewport.x,
        height: viewport.y,
        autostart: true,
    });
    two.appendTo(container);
    
    var circle1 = new Obstacle(viewport.x/2 - 200, viewport.y/2, 30);
    var circle2 = new Obstacle(viewport.x/2 + 200, viewport.y/2, 30);
    var circle3 = new Obstacle(viewport.x/2, viewport.y/2 + 30, 80);
});