;

var constants;
(function (constants) {
    constants.ANTI_CLOCKWISE = 'ANTI_CLOCKWISE';
    constants.CLOCKWISE = 'CLOCKWISE';
    constants.CENTER = 'CENTER';

    constants.TRACK_SPACING = 27.5;
    constants.TRACK_WIDTH = 10;
})(constants || (constants = {}));
;
/// <reference path="./common.ts"/>
/*
<svg id="context" width="688" height="350">
<g id="obstacles"></g>
<g id="innerOrbits"></g>
<g id="outerOrbits"></g>
<g id="tracks"></g>
<g id="labels"></g>
</svg>
*/
var scene;
(function (scene) {
    
    var c = constants;

    var Scene = (function () {
        function Scene(config) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svg.setAttribute("width", config.width.toString());
            svg.setAttribute("height", config.height.toString());
            config.parent.insertBefore(svg, config.parent.firstChild);

            var obstacles = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            obstacles.setAttribute("class", "obstacles");
            svg.appendChild(obstacles);

            var innerOrbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            innerOrbits.setAttribute("class", "innerOrbits");
            svg.appendChild(innerOrbits);

            var outerOrbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            outerOrbits.setAttribute("class", "outerOrbits");
            svg.appendChild(outerOrbits);

            var tracks = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            tracks.setAttribute("class", "tracks");
            svg.appendChild(tracks);

            var labels = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            labels.setAttribute("class", "labels");
            svg.appendChild(labels);

            this.groups = {
                obstacles: obstacles,
                innerOrbits: innerOrbits,
                outerOrbits: outerOrbits,
                tracks: tracks,
                labels: labels
            };
        }
        return Scene;
    })();
    scene.Scene = Scene;
})(scene || (scene = {}));
/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>
var obstacle;
(function (obstacle) {
    
    var c = constants;
    var Scene = scene.Scene;

    var Obstacle = (function () {
        function Obstacle(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        Obstacle.prototype.fixedModulo = function (input, modulus) {
            // This messy equation is required because javascript doesn't give the correct value for
            // the modulus of negative angles.
            return ((input % modulus) + modulus) % modulus;
        };

        Obstacle.prototype.getDistance = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = other.y - this.y;

            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        };

        Obstacle.prototype.getAngle = function (other) {
            var deltaX = other.x - this.x;
            var deltaY = this.y - other.y;

            var rawAngle = Math.atan2(deltaX, deltaY);
            var normalisedAngle = this.fixedModulo(rawAngle, 2 * Math.PI);

            return normalisedAngle;
        };

        Obstacle.prototype.getPointFromAngle = function (angle, radiusOffset) {
            //| IMPORTANT: the coordinate systems are:
            //|  - for cartesian points, y _decreases_ as the point moves up the page.
            //|  - for angles, north is 0 radians, and east is pi/2 radians.
            // make sure angle is in the range (0, 2*Math.PI).
            angle = this.fixedModulo(angle, 2 * Math.PI);

            // If you rotate point (px, py) around point (ox, oy) by angle theta you'll get:
            // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
            // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
            var effectiveRadius = this.radius + radiusOffset;
            var point = {
                x: this.x + effectiveRadius * Math.sin(angle),
                y: this.y - effectiveRadius * Math.cos(angle)
            };

            return point;
        };

        Obstacle.prototype.angularRadiusFrom = function (other, radiusOffset) {
            //| This method determines how wide (in radians) the obstacle appears when viewed from other.
            //| Obstacles with a larger radius will return a larger value, and more distant 'other' points
            //| will result in a smaller value being returned.
            //| Radius offset is an additional value which should be added to the radius. In many cases,
            //| this will be the track spacing.
            var distance = this.getDistance(other);
            var linearRadius = this.radius + radiusOffset;
            var angularRadius = Math.asin(linearRadius / distance);

            return angularRadius;
        };

        Obstacle.prototype.angularLengthOfArc = function (startPoint, endPoint, direction) {
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

        Obstacle.prototype.paint = function (scene) {
            // config must have x, y, and radius properties.
            var buildCircle = function (x, y, radius) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttribute("cx", x.toString());
                circle.setAttribute("cy", y.toString());
                circle.setAttribute("r", radius.toString());
                return circle;
            };

            var buildLabel = function (x, y, text) {
                var label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                label.setAttribute("x", x.toString());
                label.setAttribute("y", y.toString());
                label.textContent = text;
                return label;
            };

            var ringOneRadius = this.radius + c.TRACK_SPACING - c.TRACK_WIDTH / 2;

            var element;

            var dotRadius = 7.5;
            element = buildCircle(this.x, this.y, this.radius);
            scene.groups.obstacles.appendChild(element);

            element = buildCircle(this.x, this.y, ringOneRadius);
            scene.groups.innerOrbits.appendChild(element);
        };
        return Obstacle;
    })();
    obstacle.Obstacle = Obstacle;
})(obstacle || (obstacle = {}));
/// <reference path="./common.ts"/>
/// <reference path="./obstacle.ts"/>
var stretch;
(function (stretch) {
    
    var c = constants;
    var Obstacle = obstacle.Obstacle;

    var algorithms = {
        CENTER: {
            CENTER: function (startObstacle, endObstacle) {
                return {
                    start: startObstacle,
                    end: endObstacle
                };
            },
            CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = endObstacle.angularRadiusFrom(startObstacle, c.TRACK_SPACING);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: startObstacle,
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },
            ANTI_CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = endObstacle.angularRadiusFrom(startObstacle, c.TRACK_SPACING);

                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;

                return {
                    start: startObstacle,
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            }
        },
        CLOCKWISE: {
            CENTER: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = startObstacle.angularRadiusFrom(endObstacle, c.TRACK_SPACING);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle
                };
            },
            CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var distance = startObstacle.getDistance(endObstacle);

                var radiusDifference = endObstacle.radius - startObstacle.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                var angleOfStart = angleOfEnd;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },
            ANTI_CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var radiusOffset = endObstacle.radius + 2 * c.TRACK_SPACING;
                var angularRadius = startObstacle.angularRadiusFrom(endObstacle, radiusOffset);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;
                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            }
        },
        ANTI_CLOCKWISE: {
            CENTER: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = startObstacle.angularRadiusFrom(endObstacle, c.TRACK_SPACING);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle
                };
            },
            CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var distance = startObstacle.getDistance(endObstacle);

                var radiusSum = endObstacle.radius + startObstacle.radius + 2 * c.TRACK_SPACING;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;
                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },
            ANTI_CLOCKWISE: function (startObstacle, endObstacle) {
                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var distance = startObstacle.getDistance(endObstacle);

                var radiusDifference = endObstacle.radius - startObstacle.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfStart = angleBetweenCenters + angularRadius + Math.PI / 2;
                var angleOfEnd = angleOfStart;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            }
        }
    };

    var Stretch = (function () {
        function Stretch(startObstacle, startWrapDirection, endObstacle, endWrapDirection) {
            var wrapAlgorithm = algorithms[startWrapDirection][endWrapDirection];
            var endpoints = wrapAlgorithm(startObstacle, endObstacle);

            this.start = endpoints.start;
            this.end = endpoints.end;
        }
        return Stretch;
    })();
    stretch.Stretch = Stretch;
})(stretch || (stretch = {}));
/// <reference path="./common.ts"/>
/// <reference path="./stretch.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./obstacle.ts"/>
var track;
(function (track) {
    
    var c = constants;
    var Stretch = stretch.Stretch;
    var Scene = scene.Scene;
    var Obstacle = obstacle.Obstacle;

    var Track = (function () {
        function Track(startObs, width) {
            this.instructions = [];
            this.width = width;

            this.currentObs = startObs;
            this.currentWrapMode = c.CENTER;

            this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            this.moveTo(startObs);
        }
        Track.prototype.moveTo = function (dest) {
            this.instructions.push("M", dest.x, dest.y);
            this.currentLineEndPoint = dest;
        };

        Track.prototype.lineTo = function (dest) {
            this.instructions.push("L ", dest.x, dest.y);
            this.currentLineEndPoint = dest;
        };

        Track.prototype.arcTo = function (dest) {
            if (this.currentWrapMode === c.CENTER)
                return;

            var effectiveRadius = this.currentObs.radius + c.TRACK_SPACING;
            var angularDistance = this.currentObs.angularLengthOfArc(this.currentLineEndPoint, dest, this.currentWrapMode);

            var rx = effectiveRadius;
            var ry = effectiveRadius;
            var xAxisRot = 0;
            var largeArcFlag = (angularDistance > Math.PI) ? 1 : 0;
            var sweepFlag = (this.currentWrapMode === c.CLOCKWISE) ? 1 : 0;
            var x = dest.x;
            var y = dest.y;

            this.instructions.push("A", rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y);
            this.currentLineEndPoint = dest;
        };

        Track.prototype.nextSegment = function (nextObs, direction) {
            var stretch = new Stretch(this.currentObs, this.currentWrapMode, nextObs, direction);

            this.arcTo(stretch.start);
            this.lineTo(stretch.end);

            this.currentObs = nextObs;
            this.currentWrapMode = direction;
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
            var instructionString = this.instructions.join(" ");

            this.pathElement.setAttribute("d", instructionString);
            this.pathElement.setAttribute("stroke-width", this.width.toString());
            scene.groups.tracks.appendChild(this.pathElement);

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
/// <reference path="./common.ts"/>
/// <reference path="./stretch.ts"/>
/// <reference path="./track.ts"/>
/// <reference path="./obstacle.ts"/>
/// <reference path="./paintableSet.ts"/>
/// <reference path="./scene.ts"/>
var SVG_WIDTH = 688;

var examples;
(function (examples) {
    
    var c = constants;
    var Scene = scene.Scene;
    var Stretch = stretch.Stretch;
    var Track = track.Track;
    var Obstacle = obstacle.Obstacle;
    var PaintableSet = paintableSet.PaintableSet;

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
                foo: new Track(obs.r2c1, c.TRACK_WIDTH),
                bar: new Track(obs.r1c2, c.TRACK_WIDTH),
                baz: new Track(obs.r1c3, c.TRACK_WIDTH)
            });

            tracks.foo.clockwise(obs.r2c2).clockwise(obs.r3c3).anticlockwise(obs.r2c2).center(obs.r3c1);

            obs.paint(scene);
            tracks.paint(scene);
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
