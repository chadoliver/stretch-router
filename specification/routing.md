#### How do we determine the stretch when a track is routed around two obstacles, for given wrap radii and wrap directions?

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
#### How do we determine when a track needs to wrap around an obstacle?


----------------------------------------------------------------------------------------------------
#### How do we negotiate wrap order and wrap radius for many tracks which wrap around the same obstacles?


----------------------------------------------------------------------------------------------------
#### How do we calculate the impact of a change on track routes, such as moving a components or routing a track inside a pre-existing wrap?


----------------------------------------------------------------------------------------------------
#### When a user undos the most recent wrap, how do we determine the length and position of the exposed stretch?

----------------------------------------------------------------------------------------------------
#### Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?"


----------------------------------------------------------------------------------------------------
#### How do we determine which routes are impassable?


----------------------------------------------------------------------------------------------------
#### More generally, how do we determine keep-out regions, such as those around obstacles from a different net?


----------------------------------------------------------------------------------------------------
#### What happens when the user moves their mouse over a keep-out region while routing a track?


----------------------------------------------------------------------------------------------------
#### What is the UX for beginning/pausing/completing a route?


----------------------------------------------------------------------------------------------------
#### How do we select and manipulate a set of tracks, as a bus?


----------------------------------------------------------------------------------------------------
### How do we allow the user to push other tracks aside when routing a track?

This will probably involve creating a 'virtual' obstacle at the head of the active track.


----------------------------------------------------------------------------------------------------
### How do we allow the user to make small changes to a track's route, such as moving it to the other side of an obstacle? How does this work when operating on multiple tracks at once?


----------------------------------------------------------------------------------------------------
#### How do we deal with nets which have multiple intersecting tracks? D


----------------------------------------------------------------------------------------------------
### How do we implement auto-complete? How can we make the results predictable?

















