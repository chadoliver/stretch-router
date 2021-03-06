/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
/// <reference path="./point.ts"/>

module circle {
    
    import c = constants;
    import Scene = scene.Scene;
    import Point = point;
    
    
    export interface Interface {
        x: number;
        y: number;
        radius: number;
    }
    
    export class SVG implements Interface {
        
        public x :number;
        public y :number;
        public radius :number;

        constructor(x:number, y:number, radius:number) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        
        public paint(scene:Scene, groupID:string) {
                
            var element :Element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            element.setAttribute("cx", this.x.toString());
            element.setAttribute("cy", this.y.toString());
            element.setAttribute("r", this.radius.toString());

            scene.groups[groupID].appendChild(element);
        }
    }
    
    
    export class Geometry extends SVG {
        
        public fixedModulo(input:number, modulus:number) {
            // This messy equation is required because javascript doesn't give the correct value for 
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus; 
        }

        public getDistance(other:Point.Interface) :number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public getAngle(other:Point.Interface) :number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
            
            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

            return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
        }

        public angularLengthOfArc(startPoint:Point.Interface, endPoint:Point.Interface, direction:string): number {

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
        
        public getPointFromAngle(angle:number, wrapRadius:number=this.radius) :Point.Interface {
            
            //| IMPORTANT: the coordinate systems are:
            //|  - for cartesian points, y _decreases_ as the point moves up the page.
            //|  - for angles, north is 0 radians, and east is pi/2 radians.
            
            // make sure angle is in the range (0, 2*Math.PI).  
            angle = this.fixedModulo(angle, 2*Math.PI); 
            
            // If you rotate point (px, py) around point (ox, oy) by angle theta you'll get:
            // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
            // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
            var point: Point.Interface = {
                x: this.x + wrapRadius*Math.sin(angle),
                y: this.y - wrapRadius*Math.cos(angle),
            };

            return point;
        }

        public angularRadiusFrom(other:Point.Interface, wrapRadius:number=this.radius) :number {
            
            //| This method determines how wide (in radians) the obstacle appears when viewed from other.
            //| Obstacles with a larger radius will return a larger value, and more distant 'other' points
            //| will result in a smaller value being returned.
            //| Radius offset is an additional value which should be added to the radius. In many cases,
            //| this will be the track spacing.

            var distance = this.getDistance(other);
            var angularRadius = Math.asin(wrapRadius / distance);

            return angularRadius;
        }
    }
}