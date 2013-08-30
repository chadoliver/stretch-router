/// <reference path="./constants.ts"/>
/// <reference path="./track.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./paintableSet.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./series/tangent.ts"/>
/// <reference path="./series/path.ts"/>
/// <reference path="./series/circle.ts"/>

var SVG_WIDTH = 690;

module examples {

    import c = constants;
    import PaintableSet = paintableSet.PaintableSet;
    import Scene = scene.Scene;
    import Obstacle = obstacle.Obstacle;
    import Track = track.Track;
    import Tangent = tangent;
    import Path = path;
    import Circle = circle;
    
    /*
    var topObstacle = new Obstacle(245, 105, 75, "topObstacle");
    var bottomObstacle = new Obstacle(380, 260, 80, "bottomObstacle");
    var topStart = new Obstacle(94, 140, 20, "topStart");
    var bottomStart = new Obstacle(50, 260, 20, "bottomStart");
    var topEnd = new Obstacle(600, 110, 20, "topEnd");
    var bottomEnd = new Obstacle(540, 180, 20, "bottomEnd");
    */
    
    var recipes = {
        
        firstExample: function (element:Element) {
            
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: 350,
            });
    
            var obs = PaintableSet({
                r1c1: new Obstacle(194, 75,  7.5),
                r1c2: new Obstacle(294, 75,  7.5),
                r1c3: new Obstacle(394, 75,  7.5),
                r1c4: new Obstacle(494, 75,  7.5),
                r2c1: new Obstacle(194, 175, 7.5),
                r2c2: new Obstacle(294, 175, 7.5),
                r2c3: new Obstacle(394, 175, 7.5),
                r2c4: new Obstacle(494, 175, 7.5),
                r3c1: new Obstacle(194, 275, 7.5),
                r3c2: new Obstacle(294, 275, 7.5),
                r3c3: new Obstacle(394, 275, 7.5),
                r3c4: new Obstacle(494, 275, 7.5),
            });
            
            var tracks = PaintableSet({
                foo: new Track( obs.r1c1, c.TRACK_WIDTH ),
            });
            
            tracks.foo.clockwise( obs.r1c2 )
                      .clockwise( obs.r2c2 )
                      .anticlockwise( obs.r2c1 )
                      .center( obs.r3c2 )
                      .center( obs.r3c3 )
                      .anticlockwise( obs.r3c4 )
                      .anticlockwise( obs.r2c4 )
                      .clockwise( obs.r2c3 )
                      .center( obs.r1c4 );
            
            obs.paint(scene);
            tracks.paint(scene);
        },
        
        secondExample: function (element:Element) {
            
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: 300,
            });
    
            var obs = PaintableSet({
                topObstacle : new Obstacle(245 +20, 105, 75),
                bottomObstacle : new Obstacle(380 +20, 260, 80),
                topStart : new Obstacle(94 +20, 140, 20),
                bottomStart : new Obstacle(50 +20, 260, 20),
                topEnd : new Obstacle(600 +20, 110, 20),
                bottomEnd : new Obstacle(540 +20, 180, 20),
            });
            
            var tracks = PaintableSet({
                foo: new Track( obs.topStart, c.TRACK_WIDTH ),
                bar: new Track( obs.bottomStart, c.TRACK_WIDTH),
            });
            
            tracks.foo.anticlockwise( obs.topObstacle )
                      .clockwise( obs.bottomObstacle )
                      .center( obs.bottomEnd );
            
            tracks.bar.clockwise( obs.topStart )
                      .clockwise( obs.topObstacle )
                      .center( obs.topEnd );
            
            obs.paint(scene);
            tracks.paint(scene);
        },
        
        thirdExample: function (element:Element) {
            
            var SVG_HEIGHT = 350;
            
            // Set up the scene
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: SVG_HEIGHT,
            });
            
            // Add two obstacles to the scene
            var halfHeight = SVG_HEIGHT / 2
            var obs = PaintableSet({
                left : new Obstacle(halfHeight+10, 175, 30),
                right : new Obstacle(SVG_WIDTH-halfHeight-70, 175, 50),
                start: new Obstacle(-100, 175, 10),                         // start and end are just aids to help construct the track.
                end: new Obstacle(SVG_WIDTH+100, 175, 10),
            });
            
            
            // Create an orbit representing the summed wrap radii of both obstacles. Assume 20px spacing, 10px width for track.
            var leftWrapRadius = obs.left.negotiateWrapRadius(20, 10);
            var rightWrapRadius = obs.right.negotiateWrapRadius(20, 10);
            var summedRadius = new Circle.Geometry(
                obs.right.x, 
                obs.right.y, 
                leftWrapRadius + rightWrapRadius
            );
            
            // create and register an anticlockwise to clockwise stretch.
            var track = new Track(obs.start, 10);
            track.anticlockwise(obs.left);
            track.clockwise(obs.right);
            track.center(obs.end);
            
            
            // Create a right angle triangle, connecting the centers of both obstacles and a point on summedRadius.
            // The line between the obstacles is the hypotenuse.
            var tangent = new Tangent.Geometry({
                start: {
                    circle: obs.left,
                    direction: c.CENTER,
                    radius: summedRadius.radius,
                },
                end: {
                    circle: summedRadius, 
                    direction: c.CLOCKWISE,
                    radius: summedRadius.radius,
                }
            });
            var annotation = new Path.SVG(obs.left, 2);
            annotation.lineTo(tangent.end);
            annotation.lineTo(obs.right);
            annotation.lineTo(obs.left);
            
            
            // paint everything to the screen.
            obs.paint(scene);
            summedRadius.paint(scene, 'orbits');
            annotation.paint(scene, scene.ANNOTATIONS);
            track.paint(scene);
            
        },
        
    };
    
    export function paint() {
        
        for (var id in recipes) {
            
            // For each function in recipes, try to find the corresponding id in the document. If it
            // exists, execute the function (this will make an SVG drawing in the element with that
            // id).
            
            var htmlElement = document.getElementById(id);
            if (htmlElement) {
                var func = recipes[id];
                func(htmlElement);
            }
        }
    }
}
