module geometry {

    export interface FiniteLine {
        start: Point;
        end: Point;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Circle extends Point {
        radius: number;
    }
};

module constants {

    export var ANTI_CLOCKWISE = 'ANTI_CLOCKWISE';
    export var CLOCKWISE = 'CLOCKWISE';
    export var CENTER = 'CENTER';

    export var TRACK_SPACING = 20;
    export var TRACK_WIDTH = 6;
};