/// <reference path="./common.ts"/>
/// <reference path="./obstacle.ts"/>

module stretch {

    import g = geometry;
    import c = constants;
    import Obstacle = obstacle.Obstacle;

    var algorithms :any = {

        CENTER: {

            CENTER: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                return {
                    start: startObstacle,
                    end: endObstacle
                };
            },

            CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = endObstacle.angularRadiusFrom(startObstacle, c.TRACK_SPACING);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: startObstacle,
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },

            ANTI_CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = endObstacle.angularRadiusFrom(startObstacle, c.TRACK_SPACING);

                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;       // perhaps this should be 3*Math.PI/2 ?

                return {
                    start: startObstacle,
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },
        },

        CLOCKWISE: {

            CENTER: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = startObstacle.angularRadiusFrom(endObstacle, c.TRACK_SPACING);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle
                };
            },

            CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

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

            ANTI_CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var radiusOffset = endObstacle.radius + 2*c.TRACK_SPACING;
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

            CENTER: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var angularRadius = startObstacle.angularRadiusFrom(endObstacle, c.TRACK_SPACING);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;           // perhaps this should be 3*Math.PI/2 ?

                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle
                };
            },

            CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

                var angleBetweenCenters = startObstacle.getAngle(endObstacle);
                var distance = startObstacle.getDistance(endObstacle);

                var radiusSum = endObstacle.radius + startObstacle.radius + 2*c.TRACK_SPACING;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;
                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;


                return {
                    start: startObstacle.getPointFromAngle(angleOfStart, c.TRACK_SPACING),
                    end: endObstacle.getPointFromAngle(angleOfEnd, c.TRACK_SPACING)
                };
            },

            ANTI_CLOCKWISE: function (startObstacle: Obstacle, endObstacle: Obstacle): g.FiniteLine {

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

    export class Stretch implements g.FiniteLine {

        public start: g.Point;
        public end: g.Point;

        constructor(startObstacle:Obstacle, startWrapDirection, endObstacle:Obstacle, endWrapDirection) {

            var wrapAlgorithm = algorithms[startWrapDirection][endWrapDirection];
            var endpoints = wrapAlgorithm(startObstacle, endObstacle);

            this.start = endpoints.start;
            this.end = endpoints.end;
        }
    }
}