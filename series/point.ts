/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>

module point {
    
    import c = constants;
    import Scene = scene.Scene;
    import Circle = circle;
    
    export interface Interface {
        x: number;
        y: number;
    }
    
    export class SVG implements Interface {
        
        public x :number;
        public y :number;
        public radius :number;

        constructor(x:number, y:number, radius:number=2.5) {
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
        
        private fixedModulo(input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for 
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus; 
        }

        public getDistance(other:Interface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public getAngle(other:Interface): number {

            var deltaX: number = other.x - this.x;
            var deltaY: number = this.y - other.y;      // remember, y _decreases_ as the point moves up the page.
            
            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2*Math.PI);

            return normalisedAngle;      // IMPORTANT: this gives the angle clockwise from north.
        }
    };
    
}