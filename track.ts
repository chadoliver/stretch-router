/// <reference path="./common.ts"/>
/// <reference path="./tangent.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./svg.ts"/>

module track {

    import i = interfaces;
    import c = constants;
    import tangent = tangent;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;
    import PathSVG = svg.PathSVG;

    export class Track {
        
        public width :number;
        public trackSpacing :number;
        
        private currentObs;
        private currentWrapMode;
        private currentLineEndPoint :i.PointInterface;
        private path :PathSVG;
        
        constructor(startObs:i.PointInterface, width:number, trackSpacing:number=c.TRACK_SPACING) {
            
            this.width = width;
            this.trackSpacing = trackSpacing;
            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;
            this.currentWrapRadius = startObs.negotiateWrapRadius(trackSpacing, width);
            this.path = new PathSVG(startObs, width);
        }
        
        private nextSegment(nextObs:Obstacle, direction:string) {
            
            var self = this;
            
            var nextWrapRadius = nextObs.negotiateWrapRadius(this.trackSpacing, this.width);

            var tangent = new Stretch({
                start: {
                    obstacle: self.currentObs,
                    direction: self.currentWrapMode,
                    radius: self.currentWrapRadius,
                },
                end: {
                    obstacle: nextObs,
                    direction: direction,
                    radius: nextWrapRadius,
                }
            });
            
            this.path.arcTo(this.currentObs, this.currentWrapRadius, tangent.start, this.currentWrapMode);
            this.path.lineTo(tangent.end);
            
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
            this.path.paint(scene, 'tracks');
            return this;
        }
    };
};