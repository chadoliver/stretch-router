/// <reference path="./constants.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./series/circle.ts"/>
/// <reference path="./series/point.ts"/>

module obstacle {
    
    import c = constants;
    import Scene = scene.Scene;
    import Circle = circle;
    import Point = point;
    
    export interface wrapRecord {
        radius :number;
        trackWidth :number;
        minSpacing :number;
        /*entryAngle :number;
        exitAngle :number;*/
    }

    export class Obstacle extends Circle.Geometry {

        public x :number;
        public y :number;
        public radius :number; // The radius of the obstacle itself, as opposed to the  wrap radius.
        private wrapRecords :wrapRecord[] = [];

        constructor (x:number, y:number, radius:number, trackSpacing:number=c.TRACK_SPACING) {
            
            super(x, y, radius);
            
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        
        public registerWrap (record:wrapRecord) {
            this.wrapRecords.push(record);
        }
        
        public negotiateWrapRadius (minSpacing:number, trackWidth:number) :number {
            
            var outerTrack = {minSpacing:minSpacing, trackWidth:trackWidth};
            
            if (this.wrapRecords.length > 0) {
                
                var innerTrack = this.wrapRecords[this.wrapRecords.length-1];
                
                var innerTrackTotalSpacing = innerTrack.minSpacing + innerTrack.trackWidth/2 + outerTrack.trackWidth/2;
                var outerTrackTotalSpacing = outerTrack.minSpacing + innerTrack.trackWidth/2 + outerTrack.trackWidth/2;
                
                var wrapRadius = this.radius + Math.max(innerTrackTotalSpacing, outerTrackTotalSpacing);
                return wrapRadius;
            }
            else {
                var wrapRadius = this.radius + outerTrack.minSpacing + outerTrack.trackWidth/2;
                return wrapRadius;
            }
        }
        
        public paint (scene:Scene) {

            // config must have x, y, and radius properties.

            super.paint(scene, scene.OBSTACLES) // paint the core
            
            for (var i=0; i<this.wrapRecords.length; i++) {
                
                var wrap = this.wrapRecords[i];
                var innerEdge = wrap.radius - wrap.trackWidth/2 -1;
                
                var orbit = new circle.SVG(this.x, this.y, innerEdge);
                orbit.paint(scene, scene.ORBITS);
            }
        }
    }
}