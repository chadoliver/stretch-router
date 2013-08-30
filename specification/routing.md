#### What is the UX for beginning/pausing/completing a route?

In short:

- Click on an obstacle or airwire to create and route a track on that net.
- Move the mouse along the track's route. The actual relised route will be a topographic simplification of the mouse's path.
- If the mouse to close to another track, that track will be automatically pushed aside if this is possible. If this is not possible (e.g. the second track is wrapped around an immovable object), the track being routed should follow the mouse as closely as possible while preserve minimum spacing requirements. The editor should not try to automatically route the track around obstacles in order to reach the mouse position; the blocked track should still follow the line from the active obstacle to the mouse.
- Pressing a key combination should make all fixed obstacles movable. They should act as if they are on springs, and their final locations should be determined by a least-squares fit.
- To end a track, click on an obstacle or track which is part of the same net.
- To pause a track so that it can be completed later, click on anything that is not part of the same net. The head of the track will be fixed at this location until the user clicks the head again to continue routing it.


----------------------------------------------------------------------------------------------------
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

First, we need the concept of an _active obstacle_. When routing a track, the active obstacle is the last obstacle which the track is wrapped around. Initially the active obstacle is just the obstacle which the track starts from, but each time the track wraps around an obstacle that obstacle becomes the active one.

A new wrap will be made as soon as the last segment of the track intersects an obstacle. This is easiest to see if one considers a track which passes through the center of the active obstacle; the last segment is then just a straight line from the center of the active obstacle to the mouse position. 

How is this implemented in practice?

The basic idea is to convert everything to polar coordinates centered on the active obstacle. An obstacle's shadow can be simplified to a simple rectangle on the polar graph, and a wrap is detect if the mouse's path crosses one of a rectangle's edges.


----------------------------------------------------------------------------------------------------
#### How do we negotiate wrapping for tracks which wrap around the same obstacles?

Wrap order and radius can be determined separately for each obstacle.

To determine wrap order, we ignore the effect of radius. Obstacles are modelled as points, and tracks are straight lines between these points. This is equivalent to moving the components away from each other (or stretching the board out, if you will).

Determine if any set of tracks form an entrance or exit bus. An entrance bus is a set of tracks which are coming from the same obstacle, and an exit bus is a set of tracks which are going to the same obstacle. Busses are treated like a single wide track, and the ordering of tracks within the bus is preserved along the length of the bus.

For each track (or bus), determine the angles of entrance and exit. This is the angle of a straight line drawn between the target obstacle and the other (source or destination) obstacle. Note that these angles are only relevant for determining wrap order; there is no guarantee that they will correspond to the actual entrance and exit angles after accounting for wrap radius.

A valid wrap order is one which resembles a stack: tracks can only be pushed onto, and popped from, the top of the stack. If there is no such ordering, then the board description is invalid and bad stuff should happen.

Wrap radius is very simple: simply sum the track width and spacing for all inner wraps. There are a few extra details, but these are so simple that they don't need to be described.

Todo: explain how to detect and account for cascading wraps (an inner wrap increases an outer track's wrap radius to increase, and thus introduces a wrap into an adjacent stretch of the track). How do we efficiently determine when a cascade is completed and will not produce any more wraps? 


----------------------------------------------------------------------------------------------------
#### When a user presses undo after routing a track, how much is undone? If it is undone one stretch+wrap at a time, how do we determine the length and position of the hanging stretch?

----------------------------------------------------------------------------------------------------
#### Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?


----------------------------------------------------------------------------------------------------
#### How do we select and manipulate a set of tracks?

We want to slick quite closely to the 'shift+click' and 'control+click' paradigms, as most users will expect and be familiar with this. However, there are a few different scenarios which need to be examined.

The simplest case is when the user selects a set of adjacent tracks while not in 'route' mode. This is done with a simple control+click on each track. If the user clicks on one track then holds down shift while selecting the next track, a line is drawn between the two click locations. Any tracks which cross this line are added to the selection.

What if the user selects tracks which are on opposite sides of the board, and tries to route them as a bus? This must be disallowed, because it has no meaning and we can't determine what the user it trying to do. The editor should produce an error message when the user tries to switch to the router tool. (To be clear: this doesn't preclude non-routing operations on those tracks.)

When the user is in routing mode, they should be able to select other tracks by holding down the shift or control keys. This will put the user into a special selection mode, but it will not stop the selected tracks from following the mouse. In this manner, tracks selected while in routing mode are guaranteed to be adjacent and therefore a valid bus. However, it is possible that the resulting bus may be too wide to be effectively routed; this is a problem left for the user.

As much as possible, operations which work on a track should work on a set of tracks. This includes operations like rip-up, changing the PCB layer, and editing track properties.


----------------------------------------------------------------------------------------------------
#### How do we determine which routes are invalid?

The solution is based on critical cuts. A _critical cut_ is the line between the closest points on two obstacles. If all critical cuts on a route are wide enough to fit the track which is being routed (after taking into account the tracks which already pass through the critical cut), then the track is valid. Conversely, if any critical cut on the route is not wide enough, the route as a whole is impassible.

For a pair of obstacles which both have convex hulls, there is only a single critical cut. Most obstacles have convex hulls. However, if an obstacle has a concave hull then there is potential for impassible routes to be passable and vice versa: a via may be placed in the area enclosed by the concave section of the hull, and thus alter the number of tracks passing between different pairs of points.

In order to adjust for concave hulls, each via positioned between two obstacles must cause an extra critical cut to be generated. The critical cut must be placed on the other side of the via from the first critical cut.

It is important to remember that points are not the same as vertices. A critical cut might run between of a vertex of one obstacle, and a point on a line segment of the other obstacle.

It is conceivable that some critical cuts may appear valid, but may be in fact impassable due to minimum track curvature. This issue will be discussed in the section discussing all aspects of minimum track curvature.


----------------------------------------------------------------------------------------------------
#### More generally, how do we determine keep-out regions, such as those around obstacles from a different net?


----------------------------------------------------------------------------------------------------
#### What happens when the user moves their mouse over a keep-out region while routing a track?


----------------------------------------------------------------------------------------------------
#### How do we allow the user to push other tracks aside when routing a track? How do we determine which tracks cannot be pushed aside?

This will probably involve creating a 'virtual' obstacle at the head of the active track.


----------------------------------------------------------------------------------------------------
#### How do we allow the user to make small changes to a track's route, such as moving it to the other side of an obstacle? How does this work when operating on multiple tracks at once?


----------------------------------------------------------------------------------------------------
#### How do we deal with nets which have multiple intersecting tracks?


----------------------------------------------------------------------------------------------------
#### How do we implement auto-complete? How can we make the results predictable?

















