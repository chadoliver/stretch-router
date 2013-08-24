/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>

module obstacle {

    import g = geometry;
    import c = constants;
    import Scene = scene.Scene;

    export class Obstacle implements g.Circle {

        public x: number;
        public y: number;
        public radius: number;

        constructor(x:number, y:number, radius:number) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        
        private fixedModulo(input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for 
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus; 
        }

        public getDistance(other:g.Point): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public getAngle(other:g.Point): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
            
            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

            return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
        }

        public getPointFromAngle(angle:number, radiusOffset:number): g.Point {
            
            //| IMPORTANT: the coordinate systems are:
            //|  - for cartesian points, y _decreases_ as the point moves up the page.
            //|  - for angles, north is 0 radians, and east is pi/2 radians.
            
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

        public angularRadiusFrom(other: g.Point, radiusOffset: number): number {
            
            //| This method determines how wide (in radians) the obstacle appears when viewed from other.
            //| Obstacles with a larger radius will return a larger value, and more distant 'other' points
            //| will result in a smaller value being returned.
            //| Radius offset is an additional value which should be added to the radius. In many cases,
            //| this will be the track spacing.

            var distance = this.getDistance(other);
            var linearRadius = this.radius + radiusOffset;
            var angularRadius = Math.asin(linearRadius / distance);

            return angularRadius;
        }

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
            
            return this.fixedModulo(angularDistance, 2*Math.PI);
        }
        
        public paint(scene:Scene) {

            // config must have x, y, and radius properties.

            var buildCircle = function (x: number, y: number, radius: number) :Element {
                
                var circle :Element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttribute("cx", x.toString());
                circle.setAttribute("cy", y.toString());
                circle.setAttribute("r", radius.toString());
                return circle;
            };
            
            var buildLabel = function (x: number, y: number, text: string) :Element {

                var label :Element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                label.setAttribute("x", x.toString());
                label.setAttribute("y", y.toString());
                label.textContent = text;
                return label;
            };

            var ringOneRadius = this.radius + c.TRACK_SPACING - c.TRACK_WIDTH/2;

            var element :Element;
            
            var dotRadius = 7.5; // = this.radius;
            element = buildCircle(this.x, this.y, this.radius);
            scene.groups.obstacles.appendChild(element);

            element = buildCircle(this.x, this.y, ringOneRadius);
            scene.groups.innerOrbits.appendChild(element);
        }
    }
}