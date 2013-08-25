/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./point.ts"/>

module path {
    
    import c = constants;
    import Scene = scene.Scene;
    import point = point;
    import circle = circle;

    
    export class SVG {
        
        public width :number;
        
        private currentEndPoint: point.Interface;
        private pathElement: Element;
        private instructions: any[] = [];        // all elements will eventually be converted to strings, but they can be stored in their native type.
        
        constructor(start:point.Interface, width) {
            
            this.width = width;            
            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(start);
        }
        
        public moveTo(dest:point.Interface) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public lineTo(dest:point.Interface) {
            
            this.instructions.push("L ", dest.x, dest.y);
            this.currentEndPoint = dest;
        }
        
        public arcTo(pivot:circle.Geometry, wrapRadius:number, dest:point.Interface, wrapMode:string) {
        
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            
            if (wrapMode === c.CENTER) return;     // no arc is required
            
            var angularDistance = pivot.angularLengthOfArc(this.currentEndPoint, dest, wrapMode);
            
            var rx = wrapRadius;
            var ry = wrapRadius;          // This is a circle, so both axis are identical ...
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