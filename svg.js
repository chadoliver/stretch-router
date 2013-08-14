var ANTI_CLOCKWISE = 'ANTI_CLOCKWISE';
var CLOCKWISE = 'CLOCKWISE';
var CENTER = 'CENTER';

var TRACK_SPACING = 20;

var Stretch = function(obstacleA, wrapDirectionA,  obstacleB, wrapDirectionB) {
    
    var apparentAngularRadius;
    var angleOfEnd;
    var angleOfStart;
    var angleBetweenCenters = getAngle(obstacleB, obstacleA);   // calculated from an angular 'origin' of 3 o'clock.
    
    var vector = {
        x: obstacleA.x-obstacleB.x,
        y: obstacleA.y-obstacleB.y,
    };
    var distanceBetweenCenters = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
    
    if (wrapDirectionA === CENTER) {
        
        if (wrapDirectionB == CENTER) {
            this.start = obstacleA;
            this.end = obstacleB;
        }
        
        else if (wrapDirectionB === ANTI_CLOCKWISE) {
            this.start = obstacleA;
            apparentAngularRadius = Math.asin((obstacleB.radius + TRACK_SPACING) / distanceBetweenCenters); 
            angleOfEnd = 3*Math.PI/2 + angleBetweenCenters - apparentAngularRadius;
            this.end = getPoint(obstacleB, obstacleB.radius+TRACK_SPACING, angleOfEnd);
        }
        
        else if (wrapDirectionB === CLOCKWISE) {
            this.start = obstacleA;
            apparentAngularRadius = Math.asin((obstacleB.radius + TRACK_SPACING) / distanceBetweenCenters); 
            angleOfEnd = Math.PI/2 + angleBetweenCenters + apparentAngularRadius;
            this.end = getPoint(obstacleB, obstacleB.radius+TRACK_SPACING, angleOfEnd);
        }
    }
    
    else if (wrapDirectionA === ANTI_CLOCKWISE) {
        
        if (wrapDirectionB === CLOCKWISE) {
            
            /*this.start = {
                x: obstacleA.x + obstacleA.radius*Math.sin(alpha),
                y: obstacleA.y + obstacleA.radius*Math.cos(alpha),
            };
            this.end = {
                x: obstacleB.x - obstacleB.radius*Math.sin(alpha),
                y: obstacleB.y - obstacleB.radius*Math.cos(alpha),
            };*/
        }
        
        else if (wrapDirectionB === ANTI_CLOCKWISE) {
            
            apparentAngularRadius = Math.asin((obstacleB.radius + obstacleA.radius + 2*TRACK_SPACING) / distanceBetweenCenters); 
            angleOfEnd = Math.PI/2 + angleBetweenCenters + apparentAngularRadius;
            angleOfStart = angleOfEnd;
            
            this.start = getPoint(obstacleA, obstacleA.radius+20, angleOfStart);
            this.end = getPoint(obstacleB, obstacleB.radius+20, angleOfEnd);
        }
    }
    
    else if (wrapDirectionA === CLOCKWISE) {
        
        if (wrapDirectionB === ANTI_CLOCKWISE) {
            
            /*this.start = {
                x: obstacleA.x + obstacleA.radius*Math.sin(alpha),
                y: obstacleA.y - obstacleA.radius*Math.cos(alpha),
            };
            this.end = {
                x: obstacleB.x - obstacleB.radius*Math.sin(alpha),
                y: obstacleB.y + obstacleB.radius*Math.cos(alpha),
            };*/
        }
        
        else if (wrapDirectionB === CLOCKWISE) {
            apparentAngularRadius = Math.asin((obstacleB.radius + obstacleA.radius + 2*TRACK_SPACING) / distanceBetweenCenters); 
            angleOfEnd = Math.PI/2 + angleBetweenCenters + apparentAngularRadius;
            angleOfStart = angleOfEnd;
            
            this.start = getPoint(obstacleA, obstacleA.radius+20, angleOfStart);
            this.end = getPoint(obstacleB, obstacleB.radius+20, angleOfEnd);
        }
    }
};

var getAngle = function (point, origin) {
    
    if (point.x < origin.x) {
        
        if (point.y < origin.y) {
            // upper left quadrant
            return Math.PI - Math.atan((origin.y - point.y) / (origin.x - point.x));
        }
        else {
            // lower left quadrant
            return Math.PI + Math.atan((point.y - origin.y) / (origin.x - point.x));
        }
    }
    else {
        if (point.y < origin.y) {
            // upper right quadrant
            return Math.atan((origin.y - point.y) / (point.x - origin.x));
        }
        else {
            // lower right quadrant
            return 2*Math.PI - Math.atan((point.y - origin.y) / (point.x - origin.x));
        }
    }
};

var getPoint = function (origin, radius, angle) {
    
    angle = angle % (2*Math.PI);        // so angle is in the range (0, 2*Math.PI).
    
    if (angle < Math.PI/2) {
        // upper right quadrant
        return {
            x: origin.x + radius*Math.cos(angle),
            y: origin.y - radius*Math.sin(angle),
        };
    }
    else if (angle < Math.PI) {
        // upper left quadrant
        return {
            x: origin.x - radius*Math.cos(Math.PI - angle),
            y: origin.y - radius*Math.sin(Math.PI - angle),
        };
    }
    else if (angle < 3*Math.PI/2) {
        // lower left quadrant
        return {
            x: origin.x - radius*Math.cos(angle - Math.PI),
            y: origin.y + radius*Math.sin(angle - Math.PI),
        };
    }
    else {
        // lower right quadrant
        return {
            x: origin.x + radius*Math.cos(2*Math.PI - angle),
            y: origin.y + radius*Math.sin(2*Math.PI - angle),
        };
    }
};

var Wrap = function (start, end, center) {
    
    var startAngle = getAngle(start, center);
    console.log('start', startAngle);
    var endAngle = getAngle(end, center);
    console.log('end', endAngle);
    var angularStep = (endAngle - startAngle) / 10;
    console.log('step', angularStep);
    
    this.points = [new Two.Vector(start.x, start.y)];
    for (var i=1; i<10; i++) {
        var angle = startAngle + i*angularStep; 
        console.log(angle);
        var point = getPoint(center, center.wrapRadius, angle);
        this.points[i] = new Two.Vector(point.x, point.y);  
    }
    this.points[i] = new Two.Vector(end.x, end.y);
       
    var arc = two.makeCurve(this.points, true);
    arc.noFill();
    arc.linewidth = 5;
};

var SVG = function (width, height) {
    
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.setAttribute("width", "688");
    this.root.setAttribute("height", "300");
    document.getElementById("svgBox").appendChild(this.root);
    
    // create the group for obstacles
    this.obstacles = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.obstacles.setAttribute("fill", "#fff");
    this.obstacles.setAttribute("fill-opacity", "1");
    this.obstacles.setAttribute("stroke-opacity", "1");
    this.obstacles.setAttribute("stroke", "black");
    this.obstacles.setAttribute("stroke-width", "1");
    this.obstacles.setAttribute("stroke-linecap", "round");
    this.obstacles.id = "obstacles";
    this.root.appendChild(this.obstacles);
    
    // create the group for inner orbits
    this.innerOrbits = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.innerOrbits.setAttribute("fill", "transparent");
    this.innerOrbits.setAttribute("stroke-opacity", "0.2");
    this.innerOrbits.setAttribute("stroke", "black");
    this.innerOrbits.setAttribute("stroke-width", "1");
    this.innerOrbits.setAttribute("stroke-linecap", "round");
    this.innerOrbits.setAttribute("stroke-dasharray", "5,5");
    this.innerOrbits.id = "innerOrbits";
    this.root.appendChild(this.innerOrbits);
    
    // create the group for outer orbits
    this.outerOrbits = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.outerOrbits.setAttribute("fill", "transparent");
    this.outerOrbits.setAttribute("stroke-opacity", "0.2");
    this.outerOrbits.setAttribute("stroke", "black");
    this.outerOrbits.setAttribute("stroke-width", "1");
    this.outerOrbits.setAttribute("stroke-linecap", "round");
    this.outerOrbits.setAttribute("stroke-dasharray", "5,5");
    this.outerOrbits.id = "outerOrbits";
    this.root.appendChild(this.outerOrbits);
    
    // create the group for tracks
    this.tracks = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.tracks.setAttribute("stroke-opacity", "1");
    this.tracks.setAttribute("stroke", "black");
    this.tracks.setAttribute("stroke-width", "10");
    this.tracks.setAttribute("stroke-linecap", "round");
    this.tracks.id = "tracks";
    this.root.appendChild(this.tracks);
    
    var buildCircle = function (x, y, radius) {
        
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", radius.toString());
        
        return circle;
    };
    
    this.paintObstacle = function (config) {
        
        var htmlFragment;
        
        htmlFragment = buildCircle(config.x, config.y, config.radius);
        this.obstacles.appendChild(htmlFragment);
        
        htmlFragment = buildCircle(config.x, config.y, config.radius + 20);
        this.innerOrbits.appendChild(htmlFragment);
        
        htmlFragment = buildCircle(config.x, config.y, config.radius + 40);
        this.outerOrbits.appendChild(htmlFragment);
    };
    
    this.paintLine = function (config) {
        
        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        
        line.setAttribute("x1", config.start.x.toString());
        line.setAttribute("y1", config.start.y.toString());
        line.setAttribute("x2", config.end.x.toString());
        line.setAttribute("y2", config.end.y.toString());
        
        this.tracks.appendChild(line);
    }
};
        

var start = function() {
    
    var topObstacle =    { x: 295, y: 105, radius: 75 };
    var bottomObstacle = { x: 430, y: 260, radius: 80 };
    var topStart =       { x: 144, y: 140, radius: 20 };
    var bottomStart =    { x: 100, y: 260, radius: 20 };
    var topEnd =         { x: 600, y: 80,  radius: 20 };
    var bottomEnd =      { x: 550, y: 180, radius: 20 };
    
    var svg = new SVG();
    
    svg.paintObstacle(topObstacle);
    svg.paintObstacle(bottomObstacle);
    svg.paintObstacle(topStart);
    svg.paintObstacle(bottomStart);
    svg.paintObstacle(topEnd);
    svg.paintObstacle(bottomEnd);
    
    
    var line1 = new Stretch(topStart, CENTER, topObstacle, ANTI_CLOCKWISE);
    var line2 = new Stretch(bottomStart, CENTER, topStart, CLOCKWISE);
    var line3 = new Stretch(topEnd, CENTER, topObstacle, ANTI_CLOCKWISE);
    var line4 = new Stretch(bottomEnd, CENTER, bottomObstacle, ANTI_CLOCKWISE);
    var line5 = new Stretch(topStart, CLOCKWISE, topObstacle, CLOCKWISE);
    
    svg.paintLine(line1);
    svg.paintLine(line2);
    svg.paintLine(line3);
    svg.paintLine(line4);
    svg.paintLine(line5);

};

window.onload = start;




