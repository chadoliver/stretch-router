var constants;
(function (constants) {
    constants.ANTI_CLOCKWISE = 'ANTI_CLOCKWISE';
    constants.CLOCKWISE = 'CLOCKWISE';
    constants.CENTER = 'CENTER';

    constants.TRACK_SPACING = 27.5;
    constants.TRACK_WIDTH = 10;
})(constants || (constants = {}));
/// <reference path="./constants.ts"/>
var scene;
(function (scene) {
    var c = constants;

    var Scene = (function () {
        function Scene(config) {
            this.OBSTACLES = 'obstacles';
            this.ORBITS = 'orbits';
            this.TRACKS = 'tracks';
            this.LABELS = 'labels';
            this.ANNOTATIONS = 'annotations';
            var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svg.setAttribute("width", config.width.toString());
            svg.setAttribute("height", config.height.toString());
            config.parent.insertBefore(svg, config.parent.firstChild);

            var obstacles = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            obstacles.setAttribute("class", "obstacles");
            svg.appendChild(obstacles);

            var orbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            orbits.setAttribute("class", "orbits");
            svg.appendChild(orbits);

            var tracks = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            tracks.setAttribute("class", "tracks");
            svg.appendChild(tracks);

            var labels = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            labels.setAttribute("class", "labels");
            svg.appendChild(labels);

            var annotations = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            annotations.setAttribute("class", "annotations");
            svg.appendChild(annotations);

            this.groups = {
                obstacles: obstacles,
                orbits: orbits,
                tracks: tracks,
                labels: labels,
                annotations: annotations
            };
        }
        return Scene;
    })();
    scene.Scene = Scene;
})(scene || (scene = {}));
/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var point;
(function (point) {
    var c = constants;
    var Scene = scene.Scene;
    var Circle = circle;

    var SVG = (function () {
        function SVG(x, y, radius) {
            if (typeof radius === "undefined") { radius = 2.5; }
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        SVG.prototype.paint = function (scene, groupID) {
            var element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            element.setAttribute("cx", this.x.toString());
            element.setAttribute("cy", this.y.toString());
            element.setAttribute("r", this.radius.toString());

            scene.groups[groupID].appendChild(element);
        };
        return SVG;
    })();
    point.SVG = SVG;

    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        function Geometry() {
            _super.apply(this, arguments);
        }
        Geometry.prototype.fixedModulo = function (input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus;
        };

        Geometry.prototype.getDistance = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        };

        Geometry.prototype.getAngle = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = this.y - other.y;

            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2 * Math.PI);

            return normalisedAngle;
        };
        return Geometry;
    })(SVG);
    point.Geometry = Geometry;
    ;
})(point || (point = {}));
/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
/// <reference path="./point.ts"/>
var circle;
(function (circle) {
    var c = constants;
    var Scene = scene.Scene;
    var Point = point;

    var SVG = (function () {
        function SVG(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        SVG.prototype.paint = function (scene, groupID) {
            var element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            element.setAttribute("cx", this.x.toString());
            element.setAttribute("cy", this.y.toString());
            element.setAttribute("r", this.radius.toString());

            scene.groups[groupID].appendChild(element);
        };
        return SVG;
    })();
    circle.SVG = SVG;

    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        function Geometry() {
            _super.apply(this, arguments);
        }
        Geometry.prototype.fixedModulo = function (input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus;
        };

        Geometry.prototype.getDistance = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        };

        Geometry.prototype.getAngle = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = this.y - other.y;

            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2 * Math.PI);

            return normalisedAngle;
        };

        Geometry.prototype.angularLengthOfArc = function (startPoint, endPoint, direction) {
            var startAngle = this.getAngle(startPoint);
            var endAngle = this.getAngle(endPoint);
            var angularDistance;

            if (direction === c.CLOCKWISE) {
                angularDistance = endAngle - startAngle;
            } else {
                angularDistance = startAngle - endAngle;
            }

            return this.fixedModulo(angularDistance, 2 * Math.PI);
        };

        Geometry.prototype.getPointFromAngle = function (angle, wrapRadius) {
            if (typeof wrapRadius === "undefined") { wrapRadius = this.radius; }
            //| IMPORTANT: the coordinate systems are:
            //|  - for cartesian points, y _decreases_ as the point moves up the page.
            //|  - for angles, north is 0 radians, and east is pi/2 radians.
            // make sure angle is in the range (0, 2*Math.PI).
            angle = this.fixedModulo(angle, 2 * Math.PI);

            // If you rotate point (px, py) around point (ox, oy) by angle theta you'll get:
            // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
            // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
            var point = {
                x: this.x + wrapRadius * Math.sin(angle),
                y: this.y - wrapRadius * Math.cos(angle)
            };

            return point;
        };

        Geometry.prototype.angularRadiusFrom = function (other, wrapRadius) {
            if (typeof wrapRadius === "undefined") { wrapRadius = this.radius; }
            //| This method determines how wide (in radians) the obstacle appears when viewed from other.
            //| Obstacles with a larger radius will return a larger value, and more distant 'other' points
            //| will result in a smaller value being returned.
            //| Radius offset is an additional value which should be added to the radius. In many cases,
            //| this will be the track spacing.
            var distance = this.getDistance(other);
            var angularRadius = Math.asin(wrapRadius / distance);

            return angularRadius;
        };
        return Geometry;
    })(SVG);
    circle.Geometry = Geometry;
})(circle || (circle = {}));
/// <reference path="./constants.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./series/circle.ts"/>
/// <reference path="./series/point.ts"/>
var obstacle;
(function (obstacle) {
    var c = constants;
    var Scene = scene.Scene;
    var Circle = circle;
    var Point = point;

    var Obstacle = (function (_super) {
        __extends(Obstacle, _super);
        function Obstacle(x, y, radius, trackSpacing) {
            if (typeof trackSpacing === "undefined") { trackSpacing = c.TRACK_SPACING; }
            _super.call(this, x, y, radius);
            this.wrapRecords = [];

            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        Obstacle.prototype.registerWrap = function (record) {
            this.wrapRecords.push(record);
        };

        Obstacle.prototype.negotiateWrapRadius = function (minSpacing, trackWidth) {
            var outerTrack = { minSpacing: minSpacing, trackWidth: trackWidth };

            if (this.wrapRecords.length > 0) {
                var innerTrack = this.wrapRecords[this.wrapRecords.length - 1];

                var innerTrackTotalSpacing = innerTrack.minSpacing + innerTrack.trackWidth / 2 + outerTrack.trackWidth / 2;
                var outerTrackTotalSpacing = outerTrack.minSpacing + innerTrack.trackWidth / 2 + outerTrack.trackWidth / 2;

                var wrapRadius = this.radius + Math.max(innerTrackTotalSpacing, outerTrackTotalSpacing);
                return wrapRadius;
            } else {
                var wrapRadius = this.radius + outerTrack.minSpacing + outerTrack.trackWidth / 2;
                return wrapRadius;
            }
        };

        Obstacle.prototype.paint = function (scene) {
            // config must have x, y, and radius properties.
            _super.prototype.paint.call(this, scene, scene.OBSTACLES);

            for (var i = 0; i < this.wrapRecords.length; i++) {
                var wrap = this.wrapRecords[i];
                var innerEdge = wrap.radius - wrap.trackWidth / 2 - 1;

                var orbit = new circle.SVG(this.x, this.y, innerEdge);
                orbit.paint(scene, scene.ORBITS);
            }
        };
        return Obstacle;
    })(Circle.Geometry);
    obstacle.Obstacle = Obstacle;
})(obstacle || (obstacle = {}));
/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
/// <reference path="./circle.ts"/>
/// <reference path="./point.ts"/>
var tangent;
(function (tangent) {
    var c = constants;
    var Scene = scene.Scene;
    var Circle = circle;
    var Point = point;

    var algorithms = {
        CENTER: {
            CENTER: function (config) {
                return {
                    start: config.start.circle,
                    end: config.end.circle
                };
            },
            CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.end.circle.angularRadiusFrom(config.start.circle, config.end.radius);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: config.start.circle,
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            },
            ANTI_CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.end.circle.angularRadiusFrom(config.start.circle, config.end.radius);

                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;

                return {
                    start: config.start.circle,
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            }
        },
        CLOCKWISE: {
            CENTER: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.start.circle.angularRadiusFrom(config.end.circle, config.start.radius);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle
                };
            },
            CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusDifference = config.end.radius - config.start.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                var angleOfStart = angleOfEnd;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            },
            ANTI_CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;
                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            }
        },
        ANTI_CLOCKWISE: {
            CENTER: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.start.circle.angularRadiusFrom(config.end.circle, config.start.radius);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle
                };
            },
            CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;
                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            },
            ANTI_CLOCKWISE: function (config) {
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusDifference = config.end.radius - config.start.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfStart = angleBetweenCenters + angularRadius + Math.PI / 2;
                var angleOfEnd = angleOfStart;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            }
        }
    };

    var Geometry = (function () {
        function Geometry(config) {
            var wrapAlgorithm = algorithms[config.start.direction][config.end.direction];
            var endpoints = wrapAlgorithm(config);

            this.start = endpoints.start;
            this.end = endpoints.end;
        }
        return Geometry;
    })();
    tangent.Geometry = Geometry;
})(tangent || (tangent = {}));
/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
/// <reference path="./point.ts"/>
var path;
(function (path) {
    var c = constants;
    var Scene = scene.Scene;
    var Point = point;
    var Circle = circle;

    var SVG = (function () {
        function SVG(start, width) {
            this.instructions = [];
            this.width = width;
            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(start);
        }
        SVG.prototype.moveTo = function (dest) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentEndPoint = dest;
        };

        SVG.prototype.lineTo = function (dest) {
            this.instructions.push("L ", dest.x, dest.y);
            this.currentEndPoint = dest;
        };

        SVG.prototype.arcTo = function (pivot, wrapRadius, dest, wrapMode) {
            if (wrapMode === c.CENTER)
                return;

            var angularDistance = pivot.angularLengthOfArc(this.currentEndPoint, dest, wrapMode);

            var rx = wrapRadius;
            var ry = wrapRadius;
            var xAxisRot = 0;
            var largeArcFlag = (angularDistance > Math.PI) ? 1 : 0;
            var sweepFlag = (wrapMode === c.CLOCKWISE) ? 1 : 0;
            var x = dest.x;
            var y = dest.y;

            this.instructions.push("A", rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y);
            this.currentEndPoint = dest;
        };

        SVG.prototype.paint = function (scene, groupId) {
            var instructionString = this.instructions.join(" ");

            this.pathElement.setAttribute("d", instructionString);
            this.pathElement.setAttribute("stroke-width", this.width.toString());
            scene.groups[groupId].appendChild(this.pathElement);

            return this;
        };
        return SVG;
    })();
    path.SVG = SVG;
    ;
})(path || (path = {}));
/// <reference path="./constants.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./series/tangent.ts"/>
/// <reference path="./series/path.ts"/>
/// <reference path="./series/point.ts"/>
var track;
(function (track) {
    var c = constants;
    var Scene = scene.Scene;
    var Obstacle = obstacle.Obstacle;
    var Tangent = tangent;
    var Path = path;
    var Point = point;

    var Track = (function () {
        function Track(startObs, width, trackSpacing) {
            if (typeof trackSpacing === "undefined") { trackSpacing = c.TRACK_SPACING; }
            this.width = width;
            this.trackSpacing = trackSpacing;
            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;
            this.currentWrapRadius = startObs.negotiateWrapRadius(this.trackSpacing, this.width);
            this.path = new Path.SVG(startObs, width);
        }
        Track.prototype.nextSegment = function (nextObs, direction) {
            var self = this;

            var nextWrapRadius = nextObs.negotiateWrapRadius(this.trackSpacing, this.width);

            var tangent = new Tangent.Geometry({
                start: {
                    circle: self.currentObs,
                    direction: self.currentWrapMode,
                    radius: self.currentWrapRadius
                },
                end: {
                    circle: nextObs,
                    direction: direction,
                    radius: nextWrapRadius
                }
            });

            this.path.arcTo(this.currentObs, this.currentWrapRadius, tangent.start, this.currentWrapMode);
            this.path.lineTo(tangent.end);

            // TODO: this doesn't handle CENTERs properly.
            nextObs.registerWrap({
                radius: nextWrapRadius,
                trackWidth: self.width,
                minSpacing: self.trackSpacing
            });

            this.currentObs = nextObs;
            this.currentWrapMode = direction;
            this.currentWrapRadius = nextWrapRadius;
        };

        Track.prototype.clockwise = function (nextObs) {
            this.nextSegment(nextObs, c.CLOCKWISE);
            return this;
        };

        Track.prototype.anticlockwise = function (nextObs) {
            this.nextSegment(nextObs, c.ANTI_CLOCKWISE);
            return this;
        };

        Track.prototype.center = function (nextObs) {
            this.nextSegment(nextObs, c.CENTER);
            return this;
        };

        Track.prototype.paint = function (scene) {
            this.path.paint(scene, scene.TRACKS);
            return this;
        };
        return Track;
    })();
    track.Track = Track;
    ;
})(track || (track = {}));
;
/// <reference path="./scene.ts"/>
var paintableSet;
(function (paintableSet) {
    var Scene = scene.Scene;

    function PaintableSet(elements) {
        if ('paint' in this) {
            console.error('property \'paint\' already exists. Over-writing it.');
        }

        elements.paint = function (scene) {
            for (var el in this) {
                if (el !== 'paint') {
                    this[el].paint(scene);
                }
            }
        };

        return elements;
    }
    paintableSet.PaintableSet = PaintableSet;
})(paintableSet || (paintableSet = {}));
/// <reference path="./constants.ts"/>
/// <reference path="./track.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./paintableSet.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./series/tangent.ts"/>
/// <reference path="./series/path.ts"/>
/// <reference path="./series/circle.ts"/>
var SVG_WIDTH = 690;

var examples;
(function (examples) {
    var c = constants;
    var PaintableSet = paintableSet.PaintableSet;
    var Scene = scene.Scene;
    var Obstacle = obstacle.Obstacle;
    var Track = track.Track;
    var Tangent = tangent;
    var Path = path;
    var Circle = circle;

    /*
    var topObstacle = new Obstacle(245, 105, 75, "topObstacle");
    var bottomObstacle = new Obstacle(380, 260, 80, "bottomObstacle");
    var topStart = new Obstacle(94, 140, 20, "topStart");
    var bottomStart = new Obstacle(50, 260, 20, "bottomStart");
    var topEnd = new Obstacle(600, 110, 20, "topEnd");
    var bottomEnd = new Obstacle(540, 180, 20, "bottomEnd");
    */
    var recipes = {
        firstExample: function (element) {
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: 350
            });

            var obs = PaintableSet({
                r1c1: new Obstacle(194, 75, 7.5),
                r1c2: new Obstacle(294, 75, 7.5),
                r1c3: new Obstacle(394, 75, 7.5),
                r1c4: new Obstacle(494, 75, 7.5),
                r2c1: new Obstacle(194, 175, 7.5),
                r2c2: new Obstacle(294, 175, 7.5),
                r2c3: new Obstacle(394, 175, 7.5),
                r2c4: new Obstacle(494, 175, 7.5),
                r3c1: new Obstacle(194, 275, 7.5),
                r3c2: new Obstacle(294, 275, 7.5),
                r3c3: new Obstacle(394, 275, 7.5),
                r3c4: new Obstacle(494, 275, 7.5)
            });

            var tracks = PaintableSet({
                foo: new Track(obs.r1c1, c.TRACK_WIDTH)
            });

            tracks.foo.clockwise(obs.r1c2).clockwise(obs.r2c2).anticlockwise(obs.r2c1).center(obs.r3c2).center(obs.r3c3).anticlockwise(obs.r3c4).anticlockwise(obs.r2c4).clockwise(obs.r2c3).center(obs.r1c4);

            obs.paint(scene);
            tracks.paint(scene);
        },
        secondExample: function (element) {
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: 300
            });

            var obs = PaintableSet({
                topObstacle: new Obstacle(245 + 20, 105, 75),
                bottomObstacle: new Obstacle(380 + 20, 260, 80),
                topStart: new Obstacle(94 + 20, 140, 20),
                bottomStart: new Obstacle(50 + 20, 260, 20),
                topEnd: new Obstacle(600 + 20, 110, 20),
                bottomEnd: new Obstacle(540 + 20, 180, 20)
            });

            var tracks = PaintableSet({
                foo: new Track(obs.topStart, c.TRACK_WIDTH),
                bar: new Track(obs.bottomStart, c.TRACK_WIDTH)
            });

            tracks.foo.anticlockwise(obs.topObstacle).clockwise(obs.bottomObstacle).center(obs.bottomEnd);

            tracks.bar.clockwise(obs.topStart).clockwise(obs.topObstacle).center(obs.topEnd);

            obs.paint(scene);
            tracks.paint(scene);
        },
        thirdExample: function (element) {
            var SVG_HEIGHT = 350;

            // Set up the scene
            var scene = new Scene({
                parent: element,
                width: SVG_WIDTH,
                height: SVG_HEIGHT
            });

            // Add two obstacles to the scene
            var halfHeight = SVG_HEIGHT / 2;
            var obs = PaintableSet({
                left: new Obstacle(halfHeight + 10, 175, 30),
                right: new Obstacle(SVG_WIDTH - halfHeight - 70, 175, 50),
                start: new Obstacle(-100, 175, 10),
                end: new Obstacle(SVG_WIDTH + 100, 175, 10)
            });

            // Create an orbit representing the summed wrap radii of both obstacles. Assume 20px spacing, 10px width for track.
            var leftWrapRadius = obs.left.negotiateWrapRadius(20, 10);
            var rightWrapRadius = obs.right.negotiateWrapRadius(20, 10);
            var summedRadius = new Circle.Geometry(obs.right.x, obs.right.y, leftWrapRadius + rightWrapRadius);

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
                    radius: summedRadius.radius
                },
                end: {
                    circle: summedRadius,
                    direction: c.CLOCKWISE,
                    radius: summedRadius.radius
                }
            });
            var rightAngleTriangle = new Path.SVG(obs.left, 2);
            rightAngleTriangle.lineTo(tangent.end);
            rightAngleTriangle.lineTo(obs.right);
            rightAngleTriangle.lineTo(obs.left);

            // paint everything to the screen.
            obs.paint(scene);
            summedRadius.paint(scene, 'orbits');
            rightAngleTriangle.paint(scene, scene.ANNOTATIONS);
            track.paint(scene);
        }
    };

    function paint() {
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
    examples.paint = paint;
})(examples || (examples = {}));
var starter;
(function (starter) {
    // cross browser way to add an event listener
    function addListener(event, obj, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(event, fn, false);
        } else {
            obj.attachEvent("on" + event, fn);
        }
    }

    starter.start = function (callback) {
        addListener('load', window, callback);
    };
})(starter || (starter = {}));
/// <reference path="./examples.ts"/>
/// <reference path="./starter.ts"/>
starter.start(examples.paint);
