/// <reference path="../constants.ts"/>
/// <reference path="../scene.ts"/>
/// <reference path="./circle.ts"/>
/// <reference path="./point.ts"/>

module tangent {
    
    import c = constants;
    import Scene = scene.Scene;
    import Circle = circle;
    import Point = point;
    
    export interface Interface {
        start :Point.Interface;
        end :Point.Interface;
    }
    
    export interface Configuration {
        start :{
            circle :Circle.Geometry;
            direction :string;
            radius :number;
        };
        end :{
            circle :Circle.Geometry;
            direction :string;
            radius :number;
        }
    }
    
    var algorithms = {

        CENTER: {

            CENTER: function (config:Configuration): Interface {

                return {
                    start: config.start.circle,
                    end: config.end.circle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.end.circle.angularRadiusFrom(config.start.circle, config.end.radius);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                
                return {
                    start: config.start.circle,
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.end.circle.angularRadiusFrom(config.start.circle, config.end.radius);

                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;       // perhaps this should be 3*Math.PI/2 ?
                
                return {
                    start: config.start.circle,
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },
        },

        CLOCKWISE: {

            CENTER: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.start.circle.angularRadiusFrom(config.end.circle, config.start.radius);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusDifference = config.end.radius - config.start.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                var angleOfStart = angleOfEnd;
                
                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);
                
                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;
                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;
                
                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            }
        },

        ANTI_CLOCKWISE: {

            CENTER: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var angularRadius = config.start.circle.angularRadiusFrom(config.end.circle, config.start.radius);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;           // perhaps this should be 3*Math.PI/2 ?

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {

                var angleBetweenCenters = config.start.circle.getAngle(config.end.circle);
                var distance = config.start.circle.getDistance(config.end.circle);

                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;
                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: config.start.circle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.circle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {

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

    export class Geometry implements Interface {

        public start :Point.Interface;
        public end :Point.Interface;

        constructor(config:Configuration) {
                
            var wrapAlgorithm = algorithms[config.start.direction][config.end.direction];
            var endpoints = wrapAlgorithm(config);

            this.start = endpoints.start;
            this.end = endpoints.end;
        }
    }
}