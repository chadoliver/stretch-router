/// <reference path="./common.ts"/>
/// <reference path="./scene.ts"/>
/// <reference path="./point.ts"/>
/// <reference path="./obstacle.ts"/>

module tangent {
    
    import c = constants;
    import Scene = scene.Scene;
    import point = point;
    
    export interface Interface {
        start :PointInterface;
        end :PointInterface;
    }
    
    export interface Configuration {
        start :{
            obstacle :Obstacle;
            direction :string;
            radius :number;
        };
        end :{
            obstacle :Obstacle;
            direction :string;
            radius :number;
        }
    }
    
    var algorithms = {

        CENTER: {

            CENTER: function (config:Configuration): Interface {

                return {
                    start: config.start.obstacle,
                    end: config.end.obstacle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var angularRadius = config.end.obstacle.angularRadiusFrom(config.start.obstacle, config.end.radius);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                
                return {
                    start: config.start.obstacle,
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var angularRadius = config.end.obstacle.angularRadiusFrom(config.start.obstacle, config.end.radius);

                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;       // perhaps this should be 3*Math.PI/2 ?
                
                return {
                    start: config.start.obstacle,
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },
        },

        CLOCKWISE: {

            CENTER: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var angularRadius = config.start.obstacle.angularRadiusFrom(config.end.obstacle, config.start.radius);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;

                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var distance = config.start.obstacle.getDistance(config.end.obstacle);

                var radiusDifference = config.end.radius - config.start.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;
                var angleOfStart = angleOfEnd;
                
                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var distance = config.start.obstacle.getDistance(config.end.obstacle);
                
                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters + angularRadius - Math.PI / 2;
                var angleOfEnd = angleBetweenCenters + angularRadius + Math.PI / 2;
                
                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radius),
                };
            }
        },

        ANTI_CLOCKWISE: {

            CENTER: function (config:Configuration): Interface {
                
                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var angularRadius = config.start.obstacle.angularRadiusFrom(config.end.obstacle, config.start.radius);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;           // perhaps this should be 3*Math.PI/2 ?

                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle,
                };
            },

            CLOCKWISE: function (config:Configuration): Interface {

                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var distance = config.start.obstacle.getDistance(config.end.obstacle);

                var radiusSum = config.start.radius + config.end.radius;
                var angularRadius = Math.asin(radiusSum / distance);

                var angleOfStart = angleBetweenCenters - angularRadius + Math.PI / 2;
                var angleOfEnd = angleBetweenCenters - angularRadius - Math.PI / 2;

                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radiusG),
                };
            },

            ANTI_CLOCKWISE: function (config:Configuration): Interface {

                var angleBetweenCenters = config.start.obstacle.getAngle(config.end.obstacle);
                var distance = config.start.obstacle.getDistance(config.end.obstacle);

                var radiusDifference = config.end.radius - config.start.radius;
                var angularRadius = Math.asin(radiusDifference / distance);

                var angleOfStart = angleBetweenCenters + angularRadius + Math.PI / 2;
                var angleOfEnd = angleOfStart;

                return {
                    start: config.start.obstacle.getPointFromAngle(angleOfStart, config.start.radius),
                    end: config.end.obstacle.getPointFromAngle(angleOfEnd, config.end.radius)
                };
            }
        }
    };

    export class Geometry implements Interface {

        public start :point.Interface;
        public end :point.Interface;

        constructor(config:Configuration) {
                
            var wrapAlgorithm = algorithms[config.start.direction][config.end.direction];
            var endpoints = wrapAlgorithm(config);

            this.start = endpoints.start;
            this.end = endpoints.end;
        }
    }
}