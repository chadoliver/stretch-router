/// <reference path="./constants.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./series/tangent.ts"/>
/// <reference path="./series/path.ts"/>
/// <reference path="./series/point.ts"/>

module track {

    import c = constants;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;
    import Tangent = tangent;
    import Path = path;
    import Point = point;
    

    export class Track {
        
        public width :number;
        public trackSpacing :number;
        
        private currentObs :Obstacle;
        private currentWrapMode :string;
        private currentWrapRadius :number;
        private currentLineEndPoint :Point.Interface;
        private path :path.SVG;
        
        constructor(startObs:Obstacle, width:number, trackSpacing:number=c.TRACK_SPACING) {
            
            this.width = width;
            this.trackSpacing = trackSpacing;
            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;
            this.currentWrapRadius = startObs.negotiateWrapRadius(this.trackSpacing, this.width);
            this.path = new Path.SVG(startObs, width);
        }
        
        private nextSegment(nextObs:Obstacle, direction:string) {
            
            var self = this;
            
            var nextWrapRadius = nextObs.negotiateWrapRadius(this.trackSpacing, this.width);

            var tangent = new Tangent.Geometry({
                start: {
                    circle: self.currentObs,
                    direction: self.currentWrapMode,
                    radius: self.currentWrapRadius,
                },
                end: {
                    circle: nextObs,
                    direction: direction,
                    radius: nextWrapRadius,
                }
            });
            
            this.path.arcTo(this.currentObs, this.currentWrapRadius, tangent.start, this.currentWrapMode);
            this.path.lineTo(tangent.end);
            
            // TODO: this doesn't handle CENTERs properly.
            nextObs.registerWrap({
                radius: nextWrapRadius,
                trackWidth: self.width,
                minSpacing: self.trackSpacing,
            });
            
            this.currentObs = nextObs;
            this.currentWrapMode = direction;
            this.currentWrapRadius = nextWrapRadius;
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
            this.path.paint(scene, scene.TRACKS);
            return this;
        }
    };
};