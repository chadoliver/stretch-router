/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>

module svg {
    
    import i = interfaces;
    import c = constants;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;
    
    export class PathSVG {
        
        public width :number;
        
        private currentEndPoint: i.PointInterface;
        private pathElement: Element;
        private instructions: any[] = [];        // all elements will eventually be converted to strings, but they can be stored in their native type.
        
        constructor(start:i.PointInterface, width) {
            
            this.width = width;            
            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(start);
        }
        
        public moveTo(dest: i.PointInterface) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public lineTo(dest: i.PointInterface) {
            
            this.instructions.push("L ", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public arcTo(pivot:Obstacle, wrapRadius:number, dest:i.PointInterface, wrapMode:string) {
        
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
}