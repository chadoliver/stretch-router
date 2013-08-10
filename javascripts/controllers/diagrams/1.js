var frontpage = angular.module('diagram1', []);

frontpage.controller('diagram1Controller', function ($scope) {

    var Obstacle = function(x, y, radius) {
        
        var TRACK_SPACING = 20;
        this.radius = radius;
        this.wrapRadius = radius + TRACK_SPACING;
        this.x = x;
        this.y = y;
        
        this.pad = two.makeCircle(x, y, radius);
        this.keepout = two.makeCircle(x, y, radius+TRACK_SPACING);
        this.keepout.opacity = 0.5;
        this.keepout.noFill();
    };
    
    var wrapCWtoACW = function(obstacleA, obstacleB) {
        
        var vector = {
            x: obstacleA.x-obstacleB.x,
            y: obstacleA.y-obstacleB.y,
        };
        var distance = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
        var alpha = Math.asin((obstacleA.wrapRadius + obstacleB.wrapRadius) / distance); 
        
        return {
            A: {
                x: obstacleA.x + obstacleA.wrapRadius*Math.sin(alpha),
                y: obstacleA.y + obstacleA.wrapRadius*Math.cos(alpha),
            },
            B: {
                x: obstacleB.x - obstacleB.wrapRadius*Math.sin(alpha),
                y: obstacleB.y - obstacleB.wrapRadius*Math.cos(alpha),
            },
        };
    }
    
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
    
    var obstacle1 = new Obstacle(viewport.x/2 - 200,  viewport.y/2 - 20,  30);
    var obstacle2 = new Obstacle(viewport.x/2,        viewport.y/2 ,      80);
    var obstacle3 = new Obstacle(viewport.x/2 + 200,  viewport.y/2 + 20,  50);
    
    var pointset1 = wrapCWtoACW(obstacle2, obstacle3);
    two.makeLine(pointset1.A.x, pointset1.A.y, pointset1.B.x, pointset1.B.y);
    
    var pointset2 = wrapCWtoACW(obstacle2, obstacle1);
    two.makeLine(pointset2.A.x, pointset2.A.y, pointset2.B.x, pointset2.B.y);
});