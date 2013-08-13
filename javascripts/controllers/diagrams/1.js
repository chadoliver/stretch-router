var frontpage = angular.module('diagram1', []);

frontpage.controller('diagram1Controller', function ($scope) {
    
    var ANTI_CLOCKWISE = 'ANTI_CLOCKWISE';
    var CLOCKWISE = 'CLOCKWISE';
    
    var Stretch = function(obstacleA, wrapDirectionA,  obstacleB, wrapDirectionB) {
        
        var vector = {
            x: obstacleA.x-obstacleB.x,
            y: obstacleA.y-obstacleB.y,
        };
        var distance = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
        var alpha = Math.asin((obstacleA.radius + obstacleB.radius) / distance); 
        
        if (wrapDirectionA === ANTI_CLOCKWISE) {
            
            if (wrapDirectionB === CLOCKWISE) {

                this.start = {
                    x: obstacleA.x + obstacleA.radius*Math.sin(alpha),
                    y: obstacleA.y + obstacleA.radius*Math.cos(alpha),
                };
                this.end = {
                    x: obstacleB.x - obstacleB.radius*Math.sin(alpha),
                    y: obstacleB.y - obstacleB.radius*Math.cos(alpha),
                };
            }
            
            else if (wrapDirectionB === ANTI_CLOCKWISE) {
                
            }
        }
        else if (wrapDirectionA === CLOCKWISE) {
            
            if (wrapDirectionB === ANTI_CLOCKWISE) {
                
                this.start = {
                    x: obstacleA.x + obstacleA.radius*Math.sin(alpha),
                    y: obstacleA.y - obstacleA.radius*Math.cos(alpha),
                };
                this.end = {
                    x: obstacleB.x - obstacleB.radius*Math.sin(alpha),
                    y: obstacleB.y + obstacleB.radius*Math.cos(alpha),
                };
            }
            
            else if (wrapDirectionB === CLOCKWISE) {
                
            }
        }
        
        this.start.x = this.start.x.toString();
        this.start.y = this.start.y.toString();
        this.end.x = this.end.x.toString();
        this.end.y = this.end.y.toString();
    };
    
    var getAngle = function (point, origin) {
        
        if (point.x < origin.x) {
            
            if (point.y < origin.y) {
                // upper left quadrant
                return Math.PI - Math.atan((origin.y - point.y) / (origin.x - point.x));
            }
            else {
                // lower left quadrant
                return Math.PI + Math.atan((point.y - origin.y) / (origin.x - point.x));
            }
        }
        else {
            if (point.y < origin.y) {
                // upper right quadrant
                return Math.atan((origin.y - point.y) / (point.x - origin.x));
            }
            else {
                // lower right quadrant
                return 2*Math.PI - Math.atan((point.y - origin.y) / (point.x - origin.x));
            }
        }
    };
    
    var getPoint = function (origin, radius, angle) {
        
        if (angle < Math.PI/2) {
            // upper right quadrant
            console.log("upper right");
            return {
                x: origin.x + radius*Math.cos(angle),
                y: origin.y - radius*Math.sin(angle),
            };
        }
        else if (angle < Math.PI) {
            // upper left quadrant
            console.log("upper left");
            return {
                x: origin.x - radius*Math.cos(Math.PI - angle),
                y: origin.y - radius*Math.sin(Math.PI - angle),
            };
        }
        else if (angle < 3*Math.PI/2) {
            // lower left quadrant
            console.log("lower left");
            return {
                x: origin.x - radius*Math.cos(angle - Math.PI),
                y: origin.y + radius*Math.sin(angle - Math.PI),
            };
        }
        else {
            // lower right quadrant
            console.log("lower right");
            return {
                x: origin.x + radius*Math.cos(2*Math.PI - angle),
                y: origin.y + radius*Math.sin(2*Math.PI - angle),
            };
        }
    };
    
    var Wrap = function (start, end, center) {
        
        var startAngle = getAngle(start, center);
        console.log('start', startAngle);
        var endAngle = getAngle(end, center);
        console.log('end', endAngle);
        var angularStep = (endAngle - startAngle) / 10;
        console.log('step', angularStep);
        
        this.points = [new Two.Vector(start.x, start.y)];
        for (var i=1; i<10; i++) {
            var angle = startAngle + i*angularStep; 
            console.log(angle);
            var point = getPoint(center, center.wrapRadius, angle);
            this.points[i] = new Two.Vector(point.x, point.y);  
        }
        this.points[i] = new Two.Vector(end.x, end.y);
           
        var arc = two.makeCurve(this.points, true);
        arc.noFill();
        arc.linewidth = 5;
    };
    
    $scope.viewport = {
        x: 688,
        y: 300,
    };
    
    var obstacle1 = { x: 144, y: 130, radius: 50 };
    var obstacle2 = { x: 344, y: 140, radius: 100 };
    var obstacle3 = { x: 544, y: 200, radius: 70 };
    
    $scope.stretch12 = new Stretch(obstacle1, CLOCKWISE, obstacle2, ANTI_CLOCKWISE);
    $scope.stretch23 = new Stretch(obstacle2, ANTI_CLOCKWISE, obstacle3, CLOCKWISE);
    
    $scope.foo = "12";
    
    console.log($scope.stretch12);
    
    //var wrap = new Wrap(stretch1.end, stretch2.start, obstacle2);
    
});