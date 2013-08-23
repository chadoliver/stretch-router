/// <reference path="./common.ts"/>
/// <reference path="./stretch.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>

module track {

    import g = geometry;
    import c = constants;
    import Stretch = stretch.Stretch;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;

    export class Track {
        
        public width :number;
        
        private currentObs;
        private currentWrapMode;
        private currentLineEndPoint: g.Point;
        private pathElement: Element;
        private instructions: any[] = [];        // all elements will eventually be converted to strings, but they can be stored in their native type.
        
        constructor(startObs, width) {
            
            this.width = width;
            
            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;
            
            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(startObs);
        }
        
        private moveTo(dest: g.Point) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentLineEndPoint = dest;
        }
        
        private lineTo(dest: g.Point) {
            
            this.instructions.push("L ", dest.x, dest.y);
            this.currentLineEndPoint = dest;
        }
        
        private arcTo(dest: g.Point) {
        
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            
            if (this.currentWrapMode === c.CENTER) return;     // no arc is required
            
            var effectiveRadius = this.currentObs.radius + c.TRACK_SPACING;
            var angularDistance = this.currentObs.angularLengthOfArc(this.currentLineEndPoint, dest, this.currentWrapMode);
            
            var rx = effectiveRadius;
            var ry = effectiveRadius;                           // This is a circle, so both axis are identical ...
            var xAxisRot = 0;                                   // ... and rotation is meaningless.
            var largeArcFlag = (angularDistance > Math.PI) ? 1 : 0;
            var sweepFlag = (this.currentWrapMode === c.CLOCKWISE) ? 1 : 0;
            var x = dest.x;
            var y = dest.y;
            
            this.instructions.push("A", rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y);
            this.currentLineEndPoint = dest;
        }
        
        private nextSegment(nextObs:Obstacle, direction:string) {
            
            var stretch = new Stretch(this.currentObs, this.currentWrapMode, nextObs, direction);
            
            this.arcTo(stretch.start);
            this.lineTo(stretch.end);
            
            this.currentObs = nextObs;
            this.currentWrapMode = direction;
        }
        
        public clockwise(nextObs:Obstacle) {
            
            this.nextSegment(nextObs, c.CLOCKWISE);
            
            return this;
        }
        
        public anticlockwise(nextObs:Obstacle) {
            
            this.nextSegment(nextObs, c.ANTI_CLOCKWISE);
            
            return this;
        }
     
        public center(nextObs:Obstacle) {
            
            this.nextSegment(nextObs, c.CENTER);
            
            return this;
        }
        
        public paint(scene:Scene) {
            
            var instructionString: string = this.instructions.join(" ");
            
            this.pathElement.setAttribute("d", instructionString);
            this.pathElement.setAttribute("stroke-width", this.width.toString());
            scene.groups.tracks.appendChild(this.pathElement);
            
            return this;
        }
    };
};