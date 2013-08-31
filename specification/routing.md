#### What is the UX for beginning/pausing/completing a route?

In short:

- Click on an obstacle or airwire to create and route a track on that net.
- Move the mouse along the track's route. The actual relised route will be a topographic simplification of the mouse's 
path.
- If the mouse to close to another track, that track will be automatically pushed aside if this is possible. If this is
not possible (e.g. the second track is wrapped around an immovable object), the track being routed should follow the 
mouse as closely as possible while preserve minimum spacing requirements. The editor should not try to automatically 
route the track around obstacles in order to reach the mouse position; the blocked track should still follow the line 
from the active obstacle to the mouse.
- Pressing a key combination should make all fixed obstacles movable. They should act as if they are on springs, and
their final locations should be determined by a least-squares fit.
- To end a track, click on an obstacle or track which is part of the same net.
- To pause a track so that it can be completed later, click on anything that is not part of the same net. The head of
the track will be fixed at this location until the user clicks the head again to continue routing it.


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

Each circle can be wrapped in three different ways: clockwise, anticlockwise, and to the center. With two circles per 
stretch, this gives nine different functions for calculating the stretch endpoints. These are stored in a two-level 
object literal, and selected using the following code:

```javascript
var wrapAlgorithm = algorithms[config.start.direction][config.end.direction];
```

The config object is the same as described above, which is passed into the chosen function.


----------------------------------------------------------------------------------------------------
#### How do we determine when a track needs to wrap around an obstacle?

First, we need the concept of an _active obstacle_. When routing a track, the active obstacle is the last obstacle 
which the track is wrapped around. Initially the active obstacle is just the obstacle which the track starts from, but 
each time the track wraps around an obstacle that obstacle becomes the active one.

A new wrap will be made as soon as the last segment of the track intersects an obstacle. This is easiest to see if one 
considers a track which passes through the center of the active obstacle; the last segment is then just a straight line 
from the center of the active obstacle to the mouse position. 

How is this implemented in practice?

The basic idea is to convert everything to polar coordinates centered on the active obstacle. An obstacle's shadow can 
be simplified to a simple rectangle on the polar graph, and a wrap is detect if the mouse's path crosses one of a 
rectangle's edges.


----------------------------------------------------------------------------------------------------
#### How do we negotiate wrapping for tracks which wrap around the same obstacles?

Wrap order and radius can be determined separately for each obstacle.

To determine wrap order, we ignore the effect of radius. Obstacles are modelled as points, and tracks are straight lines
between these points. This is equivalent to moving the components away from each other (or stretching the board out, if 
you will).

Determine if any set of tracks form an entrance or exit bus. An entrance bus is a set of tracks which are coming from 
the same obstacle, and an exit bus is a set of tracks which are going to the same obstacle. Busses are treated like a 
single wide track, and the ordering of tracks within the bus is preserved along the length of the bus.

For each track (or bus), determine the angles of entrance and exit. This is the angle of a straight line drawn between 
the target obstacle and the other (source or destination) obstacle. Note that these angles are only relevant for 
determining wrap order; there is no guarantee that they will correspond to the actual entrance and exit angles after 
accounting for wrap radius.

A valid wrap order is one which resembles a stack: tracks can only be pushed onto, and popped from, the top of the 
stack. If there is no such ordering, then the board description is invalid and bad stuff should happen.

Wrap radius is very simple: simply sum the track width and spacing for all inner wraps. There are a few extra details, 
but these are so simple that they don't need to be described.

Todo: explain how to detect and account for cascading wraps (an inner wrap increases an outer track's wrap radius to 
increase, and thus introduces a wrap into an adjacent stretch of the track). How do we efficiently determine when a 
cascade is completed and will not produce any more wraps? 


----------------------------------------------------------------------------------------------------
#### When a user presses undo after routing a track, how much is undone? If it is undone one stretch+wrap at a time, how do we determine the length and position of the hanging stretch?

----------------------------------------------------------------------------------------------------
#### Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?


----------------------------------------------------------------------------------------------------
#### How do we select and manipulate a set of tracks?

We want to slick quite closely to the 'shift+click' and 'control+click' paradigms, as most users will expect and be 
familiar with this. However, there are a few different scenarios which need to be examined.

The simplest case is when the user selects a set of adjacent tracks while not in 'route' mode. This is done with a 
simple control+click on each track. If the user clicks on one track then holds down shift while selecting the next 
track, a line is drawn between the two click locations. Any tracks which cross this line are added to the selection.

What if the user selects tracks which are on opposite sides of the board, and tries to route them as a bus? This must 
be disallowed, because it has no meaning and we can't determine what the user it trying to do. The editor should 
produce an error message when the user tries to switch to the router tool. (To be clear: this doesn't preclude 
non-routing operations on those tracks.)

When the user is in routing mode, they should be able to select other tracks by holding down the shift or control keys.
This will put the user into a special selection mode, but it will not stop the selected tracks from following the mouse.
In this manner, tracks selected while in routing mode are guaranteed to be adjacent and therefore a valid bus. However, 
it is possible that the resulting bus may be too wide to be effectively routed; this is a problem left for the user.

As much as possible, operations which work on a track should work on a set of tracks. This includes operations like 
rip-up, changing the PCB layer, and editing track properties.


----------------------------------------------------------------------------------------------------
#### How do we determine which routes are invalid?

The solution is based on critical cuts. A _critical cut_ is the line between the closest points on two obstacles. If all
critical cuts on a route are wide enough to fit the track which is being routed (after taking into account the tracks 
which already pass through the critical cut), then the track is valid. Conversely, if any critical cut on the route is 
not wide enough, the route as a whole is impassible.

For a pair of obstacles which both have convex hulls, there is only a single critical cut. Most obstacles have convex 
hulls. However, if an obstacle has a concave hull then there is potential for impassible routes to be passable and vice 
versa: a via may be placed in the area enclosed by the concave section of the hull, and thus alter the number of tracks
passing between different pairs of points.

In order to adjust for concave hulls, each via positioned between two obstacles must cause an extra critical cut to be 
generated. The critical cut must be placed on the other side of the via from the first critical cut.

It is important to remember that points are not the same as vertices. A critical cut might run between of a vertex of 
one obstacle, and a point on a line segment of the other obstacle.

It is conceivable that some critical cuts may appear valid, but may be in fact impassable due to minimum track 
curvature. This issue will be discussed in the section discussing all aspects of minimum track curvature.


----------------------------------------------------------------------------------------------------
#### How do we determine whether the track being routed intersects a keep-out region?

First, what is a keep-out region? It is a region which cannnot legally contain the object being routed or moved. 
Usually, this is due to the fact that tracks and other objects require a minimum clearance in order to prevent 
manufacturing errors. 

For a circular object with a radius of 15mm and a minimum clearance of 5mm, the keep-out region is a circle with a 20mm 
radius. For compound objects, the keepout region is comprised of circles and straight lines. The circles are positioned 
at each vertex, and the straight lines are stretches joining the circles. Track stretches and wraps are equivalent to 
the edges and vertices of compound objects. 

It is important to note that most objects will _not_ have a keep-out region when the track which is being routed is from
the same net. This is because a short-circuit cause by insufficient clearance would not have any impact on the circuit. 

Now, how do we detect when the track intersects a keepout region?

We assume that the completed segments of the track do not intersect keep out regions, as this should have been picked 
up while they were being routed. Therefore we are only concerned with the last wrap and stretch.

We assume that the stretch will only intersect with a keepout region if the mouse path does so. Any other potential 
intersections would result in a new wrap, so they should have been detected by the trigger map. (As an aside, this 
means that the main loop needs to check for wraps before it checks for keep-out intersections).

Combined, these assumptions mean that we only have to check whether any keepout regions are intersected by the mouse
delta (the vector between the previous mouse position and the current mouse position). 

Here is an algorithm which implements these ideas:

1. When the board is first loaded, construct an R-tree of all objects that could produce keep-out regions. This 
includes tracks, pads, holes, any anything else I can think of.
2. As changes are made to the board, they should be reflected in the R-tree.
3. While routing a track, do the following each time the mouse is moved:
    1. Calculate the mouse delta path.
    2. Calculate the bounding box for the delta path.
    3. Select the leaves in the R-tree which intersect the delta path's bounding box.
    4. For each select leaf, determine whether the last stretch of the track intersects with the leaf object.
    5. Keep a record of the intersection which maximally trims the track. All other intersections may be discarded.

In order to increase the performance of the R-tree, objects should be broken down into their component primatives, and
each primative should be stored separately. It may also be useful to keep track of the rectangles which do _not_ contain
obstacles: if both ends of the mouse delta path are in an empty rectangle, there is no need to traverse the R-tree.

I do not know how to account for the fact that the track which is being routed has its own keep-out zone. One possible 
solution is simply to increase the size of the delta path bounding box, then adjust the positions of any objects 
selected from the R-tree.


----------------------------------------------------------------------------------------------------
#### What happens when the user moves their mouse over a keep-out region while routing a track?

Different objects have different degrees of movability, and this determines their behaviour when the routed track intersects their keep-out region. Some objects are absolutely immovable, some objects may be pushed aside at any time, and other objects may only be pushed aside when a special modifier key is held down. In addition, obstacles have a default position that they will try to return to, but tracks only attempt to minimise their path length within a given topographic route.

Each object has a default movability, but when adjacent to other objects they will adopt the minimum level of movability found in the group of adjacent objects. This reflects our intuition of how objects behave in real life.

By default, tracks may be pushed aside at any time. They have an initial topology, but no preferred position. The track being routed will have a 'virtual obstacle' at its tip. If the tip intersects the keep-out region of a movable track, that track will wrap around the virtual obstacle. In this sense, pushed tracks are entirely passive: they will attempt to accomodate the routed track as much as possible. Each time the virtual object moves, each track and bus is tested to determine whether it still needs to wrap around the virtual obstacle.

By default, vias may be pushed aside at any time, and obstacles may only be pushed aside when a special modifier key is held down. Both vias and obstacles are partially active in the routing process: they will 'push back' based on their own utility functions. Vias will push back in a manner which shortens the sum of all path lengths. Obstacles will try to return to their initial position, as if they were on springs. However, neither vias or obstacles will attempt to change the _topographic_ route of any track.

If the routed track intersects the keep-out region of an immovable obstacle, the routed track should be dynamically 'trimmed' so that it appears to stop at the boundary. 

I need to do more work on how vias and obstacles negotiate their positions when their utility functions conflict.

I also need to determine how immovability is propagated through adjacent objects, especially considering that this immovability must be directional.


----------------------------------------------------------------------------------------------------
#### How do we route a track between an obstacle and other pre-existing wraps?

It must be possible for a track to exit a wrap by angling inwards, not outwards.

----------------------------------------------------------------------------------------------------
#### How do we determine when a wrap is no longer needed?


----------------------------------------------------------------------------------------------------
#### How do we allow the user to move a track onto the other side of an obstacle? How does this work when operating on multiple tracks at once?


----------------------------------------------------------------------------------------------------
#### How do we deal with nets which have multiple intersecting tracks?


----------------------------------------------------------------------------------------------------
#### How do we implement auto-complete? How can we make the results predictable?


----------------------------------------------------------------------------------------------------
#### Do we need to implement minimum curve radii? How would we do this?














