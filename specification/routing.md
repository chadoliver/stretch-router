#### "A method for determining the stretch and wrap when a line is routed around two obstacles, for given wrap radii and wrap directions."

I've solved this problem. Here's the function used to calculate the endpoints of a clockwise-to-anticlockwise stretch:
```javascript
function (config:Configuration): Interface {
    
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
```

And here's the signature of the configuration object passed into the function:
```javascript
interface Configuration {
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
```

Each circle can be wrapped in three different ways: clockwise, anticlockwise, and to the center. With two circles per stretch, this gives nine different functions for calculating the stretch endpoints. These are stored in a two-level object literal, and selected using the following code:

```javascript
var wrapAlgorithm = algorithms[config.start.direction][config.end.direction];
```

The config object is the same as described above, which is passed into the chosen function.


----------------------------------------------------------------------------------------------------
#### "A method to calculate trigger lines, and determine when the mouse crosses one."


----------------------------------------------------------------------------------------------------
#### "Hanging tracks: when a user undos the most recent wrap, the exposed stretch should be shortened to an appropriate length, and perhaps rotated so that it doesn't affect other tracks"


----------------------------------------------------------------------------------------------------
#### "A method to recalculate wraps when a component is moved."


----------------------------------------------------------------------------------------------------
#### "A method to calculate the cascading impact of a particular change, such as routing a track inside a pre-existing wrap."


----------------------------------------------------------------------------------------------------
#### "A method to negotiate wrap order and radius, with an obvious focus on avoiding 'impossible' wraps."


----------------------------------------------------------------------------------------------------
#### "Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?"


----------------------------------------------------------------------------------------------------
#### "A method for determining which critical cuts are impassable."


----------------------------------------------------------------------------------------------------
#### "More generally, a method for determining keep-out regions, including those around obstacles from a different net."


----------------------------------------------------------------------------------------------------
#### "What happens when the user moves their mouse over a keep-out region?"


----------------------------------------------------------------------------------------------------
#### "What is the UX for beginning/pausing/completing a route?"


----------------------------------------------------------------------------------------------------
#### "A method for pushing tracks aside. This will probably involve creating a 'virtual' obstacle at the head of the active track."


----------------------------------------------------------------------------------------------------
#### "A method for segmenting tracks (e.g. as a consequence of creating a three-way intersection), and relating segments together."


----------------------------------------------------------------------------------------------------
#### "A method for selecting and routing a set of tracks, as a bus."














