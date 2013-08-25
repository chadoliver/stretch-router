/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>

module point {
    
    import c = constants;
    import Scene = scene.Scene;
    
    export interface Interface {
        x: number;
        y: number;
    }
    
    export class SVG {
        
        public width :number;
        
        private currentEndPoint :Interface;
        private pathElement :Element;
        private instructions :any[] = [];        // all elements will eventually be converted to strings, but they can be stored in their native type.
        
        constructor(start:Interface, width) {
            
            this.width = width;            
            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(start);
        }
        
        public moveTo(dest:Interface) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public lineTo(dest:Interface) {
            
            this.instructions.push("L ", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public arcTo(pivot:Obstacle, dest:Interface, wrapMode:string) {
        
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            
            if (wrapMode === c.CENTER) return;     // no arc is required
            
            var angularDistance = pivot.angularLengthOfArc(this.currentEndPoint, dest, wrapMode);
            
            var rx = pivot.getCurrentWrapRadius();
            var ry = pivot.getCurrentWrapRadius();          // This is a circle, so both axis are identical ...
            var xAxisRot = 0;                               // ... and rotation is meaningless.
            var largeArcFlag = (angularDistance > Math.PI) ? 1 : 0;
            var sweepFlag = (wrapMode === c.CLOCKWISE) ? 1 : 0;
            var x = dest.x;
            var y = dest.y;
            
            this.instructions.push("A", rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y);
            this.currentEndPoint = dest;
        }
        
        public paint(scene:Scene, groupId:string) {
            
            var instructionString: string = this.instructions.join(" ");
            
            this.pathElement.setAttribute("d", instructionString);
            this.pathElement.setAttribute("stroke-width", this.width.toString());
            scene.groups[groupId].appendChild(this.pathElement);
            
            return this;
        }
    };

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