/// <reference path="./common.ts"/>
/// <reference path="./stretch.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./path.ts"/>

module track {

    import g = geometry;
    import c = constants;
    import Stretch = stretch.Stretch;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;
    import Path = path.Path;

    export class Track {
        
        public width :number;
        
        private currentObs;
        private currentWrapMode;
        private currentLineEndPoint :g.Point;
        private path :Path;
        
        constructor(startObs:g.Point, width) {
            
            this.width = width;
            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;
            this.path = new Path(startObs, width);
        }
        
        private nextSegment(nextObs:Obstacle, direction:string) {
            
            var stretch = new Stretch(this.currentObs, this.currentWrapMode, nextObs, direction);
            
            this.path.arcTo(this.currentObs, stretch.start, this.currentWrapMode);
            this.path.lineTo(stretch.end);
            
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
            
            this.path.paint(scene, 'tracks');
            
            return this;
        }
    };
};