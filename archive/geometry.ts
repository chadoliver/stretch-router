/// <reference path="./common.ts"/>
/// <reference path="./stretch.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./svg.ts"/>



module geometry {
    
    import i = interfaces;
    import c = constants;
    import Stretch = stretch.Stretch;
    import Scene = scene.Scene;
    import PointSVG = svg.PointSVG;
    import CircleSVG = svg.CircleSVG;
    
    export class PointGeo extends PointSVG {
        
        private fixedModulo(input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for 
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus; 
        }

        public getDistance(other:i.PointInterface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public getAngle(other:i.PointInterface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
            
            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

            return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
        }
        
    };
    
    export class CircleGeo extends CircleSVG {
        
        private fixedModulo(input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for 
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus; 
        }

        public getDistance(other:i.PointInterface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public getAngle(other:i.PointInterface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
            
            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

            return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
        }

        public getPointFromAngle(angle:number): i.PointInterface {
            
            //| IMPORTANT: the coordinate systems are:
            //|  - for cartesian points, y _decreases_ as the point moves up the page.
            //|  - for angles, north is 0 radians, and east is pi/2 radians.
            
            // make sure angle is in the range (0, 2*Math.PI).  
            angle = this.fixedModulo(angle, 2*Math.PI); 
            
            // If you rotate point (px, py) around point (ox, oy) by angle theta you'll get:
            // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
            // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
            var point: i.PointInterface = {
                x: this.x + this.radius*Math.sin(angle),
                y: this.y - this.radius*Math.cos(angle),
            };

            return point;
        }

        public angularRadiusFrom(other:i.PointInterface): number {
            
            //| This method determines how wide (in radians) the obstacle appears when viewed from other.
            //| Obstacles with a larger radius will return a larger value, and more distant 'other' points
            //| will result in a smaller value being returned.
            //| Radius offset is an additional value which should be added to the radius. In many cases,
            //| this will be the track spacing.

            var distance = this.getDistance(other);
            var linearRadius = this.radius + radiusOffset;
            var angularRadius = Math.asin(this.radius / distance);

            return angularRadius;
        }

        public angularLengthOfArc(startPoint:i.PointInterface, endPoint:i.PointInterface, direction:string): number {

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
    }
}