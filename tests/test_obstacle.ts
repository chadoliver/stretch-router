/// <reference path="./tester.ts"/>
/// <reference path="../common.ts"/>
/// <reference path="../obstacle.ts"/>

// TO EXECUTE: tsc typescript/tests/test_obstacle.ts --target ES5 --out javascript/tests.js && node javascript/tests.js

import Tester = testerModule.Tester;
import g = geometry;
import c = constants;

import Obstacle = obstacle.Obstacle;

var tester = new Tester();

tester.test( function(t) {
    /*
    public getDistance(other:g.Point): number {
    
        var deltaX: number = other.x - this.x;
        var deltaY: number = other.y - this.y;
    
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    */
    
    t.description = "Test the _getDistance_ method.";
    
    var subject = new Obstacle(100, 100, 20, "subject");
    var prop = new Obstacle(200, 100, 30, "prop");
    var point = {x: 100, y: 350};
    
    t.expect(  subject.getDistance(prop), 
                100 );
    
    t.expect(  subject.getDistance(prop), 
                prop.getDistance(subject) );
    
    t.expect(  subject.getDistance(point), 
                250 );
});


tester.test( function(t) {
    /*
    public getAngle(other:g.Point): number {
        var deltaX: number = other.x - this.x;
        var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
        
        var rawAngle = Math.atan2(deltaX, deltaY);
        var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

        return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
    }
    */
    
    t.description = "Test the _getAngle_ method.";
    
    var subject = new Obstacle(100, 100, 20, "subject");
    var north = {x: 100, y: 50};
    var northeast = {x: 150, y: 50};
    var east = {x: 150, y: 100};
    var west = {x: 50, y: 100};
    var northwest = {x: 50, y: 50};
    
    t.expect(  subject.getAngle(north), 
                0 );
    
    t.expect(  subject.getAngle(northeast), 
                Math.PI/4 );
    
    t.expect(  subject.getAngle(east), 
                Math.PI/2 );
    
    t.expect(  subject.getAngle(west), 
                3*Math.PI/2 );
    
    t.expect(  subject.getAngle(northwest), 
                7*Math.PI/4 );
});


tester.test( function(t) {
    /*
    public getPointFromAngle(angle:number, radiusOffset:number): g.Point {
            
        // IMPORTANT: the coordinate systems are:
        //  - for cartesian points, y _decreases_ as the point moves up the page.
        //  - for angles, north is 0 radians, and east is pi/2 radians.
        
        // make sure angle is in the range (0, 2*Math.PI).  
        angle = this.fixedModulo(angle, 2*Math.PI); 
        
        // If you rotate point (px, py) around point (ox, oy) by angle theta you'll get:
        // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
        // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
        var effectiveRadius = this.radius + radiusOffset;
        var point: g.Point = {
            x: this.x + effectiveRadius*Math.sin(angle),
            y: this.y - effectiveRadius*Math.cos(angle),
        };

        return point;
    }
    */
    
    t.description = "Test the _getPointFromAngle_ method.";
    
    var subject = new Obstacle(100, 100, 20, "subject");
    var north = {x: 100, y: 70};
    var northeast = {x:121.21320343559643, y:78.78679656440357};
    var east = {x: 150, y: 100};
    var south = {x: 100, y: 150};
    var west = {x: 90, y: 100};
    var northwest = {x:78.78679656440355,y:78.7867965644036};
    
    t.expect(   subject.getPointFromAngle(0, 10), 
                north);
    
    t.expect(   subject.getPointFromAngle(Math.PI/4, 10), 
                northeast );
    
    t.expect(   subject.getPointFromAngle(Math.PI/2, 30), 
                east );
    
    t.expect(   subject.getPointFromAngle(3*Math.PI/2, -10), 
                west );
    
    t.expect(   subject.getPointFromAngle(7*Math.PI/4, 10), 
                northwest );
    
    t.expect(   subject.getPointFromAngle(2*Math.PI, 10), 
                north);
});

tester.test( function(t) {
    /*
    public angularLengthOfArc(startPoint: g.Point, endPoint: g.Point, direction: string): number {

        var startAngle = this.getAngle(startPoint);
        var endAngle = this.getAngle(endPoint);
        var angularDistance;

        if (direction === c.CLOCKWISE) {
            angularDistance = endAngle - startAngle;
        }
        else {
            angularDistance = startAngle - endAngle;
        }
        return Math.abs(angularDistance);
    }
    */
    
    t.description = "Test the _angularLengthOfArc_ method.";
    
    var subject = new Obstacle(100, 100, 20, "subject");
    var north = {x: 100, y: 50};
    var northeast = {x:121.21320343559643, y:78.78679656440357};
    var east = {x: 150, y: 100};
    var south = {x: 100, y: 150};
    var west = {x: 90, y: 100};
    var northwest = {x:78.78679656440355,y:78.7867965644036};
    
    t.expect(   subject.angularLengthOfArc(north, northeast, c.CLOCKWISE), 
                Math.PI/4 );
    
    t.expect(   subject.angularLengthOfArc(north, northeast, c.ANTI_CLOCKWISE), 
                7*Math.PI/4 );
    
    t.expect(   subject.angularLengthOfArc(east, west, c.CLOCKWISE), 
                Math.PI );
    
    t.expect(   subject.angularLengthOfArc(east, west, c.ANTI_CLOCKWISE), 
                Math.PI );
});

tester.displayResults();
    
/*
    export class Obstacle implements g.Circle {

        public x: number;
        public y: number;
        public radius: number;
        public label: string;

        constructor(x:number, y:number, radius:number, label:string) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.label = label;
        }
        

        public angularRadiusFrom(other: g.Point, radiusOffset: number): number {

            var distance = this.getDistance(other);
            var effectiveRadius = this.radius + radiusOffset;
            var angularRadius = Math.asin(effectiveRadius / distance);

            return angularRadius;
        }

        public angularLengthOfArc(startPoint: g.Point, endPoint: g.Point, radiusOffset: number, direction: string): number {

            var startAngle = this.getAngle(startPoint);
            var endAngle = this.getAngle(endPoint);
            var angularDistance;

            if (direction === c.CLOCKWISE) {
                angularDistance = endAngle - startAngle;
            }
            else {
                angularDistance = startAngle - endAngle;
            }
            return Math.abs(angularDistance);
        }
    }
}
*/