Possible Features
=================

The purpose of this document is to list all the possible features or units of functionality that could be implemented. This is just a brainstorming exercise; it doesn't mean that these features will ever be found in the final product.

First, some vocabulary:

A _track_ is a line which (in the finished board) will be used to carry an electrical signal between pins. The _active track_ is the track which is currently being routed.

An _obstacle_ is anything which a track cannot cross and which the track must avoid. For example, a pad or a drill hole. Obstacles are initally represented by circles, but in a realistic board most obstacles will be compound shapes formed from many smaller circles.

A _wrap_ is a curved segment of track, and a _stretch_ is a straight segment of track. Wraps are always centered on obstacles.

A _trigger line_ is an imaginary line which, if crossed with the mouse, will cause the editor to wrap the current track around the associated obstacle.



### Routing The Tracks

- What is the UX for beginning/pausing/completing a route?
- How do we determine the stretch when a track is routed around two obstacles, for given wrap radii and wrap directions?
- How do we determine when a track needs to wrap around an obstacle?
- How do we negotiate wrapping for tracks which wrap around the same obstacles?
- When a user presses undo after routing a track, how much is undone? If it is undone one stretch+wrap at a time, how do we determine the length and position of the hanging stretch?
- Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?
- How do we determine which routes are impassable?
- More generally, how do we determine keep-out regions, such as those around obstacles from a different net?
- What happens when the user moves their mouse over a keep-out region while routing a track?
- How do we select and manipulate a set of tracks?
- How do we allow the user to push other tracks aside when routing a track? How do we determine which tracks cannot be pushed aside?
- How do we allow the user to make small changes to a track's route, such as moving it to the other side of an obstacle? How does this work when operating on multiple tracks at once?
- How do we deal with nets which have multiple intersecting tracks?
- How do we implement auto-complete? How can we make the results predictable?

### Moving Elements

- A method for associating elements of a component together so that they can be efficiently moved.
- A method for 'sliding' components, and determining how far they can move. The UX for such.
- A method for lifting components 'up and over'. 
- A method for 'pushing' tracks onto the other side of an obstacle.
- A method to select a set of elements, and operate on them as a group.

### Airwires and Nets

- A method of determining what points are connected with airwires. This will probably be some form of minimum spanning tree.
- A method of curving airwires to avoid ambiguous paths.
- A method of highlighting all elements on a net.

### Compound Obstacles

- A logical MVC structure
- A method for wrapping tracks around compound obstacles.

### Multi-layer Boards

- How does the user specify a layer to work on? 
- How does the user insert vias? How can the user specify whether the via should be fixed or movable?
- What heuristics can be used to determine the position of a movable via? Least squares?

### Editor Interface

- How do we support touch devices? Desktop with mouse only? Power user with mouse and keyboard?
- Is there a toolbox? What tools should be provided, aside from route, rip-up, move, rotate, and select?
- Should there be a 'properties' modal associated with each element? What should be in it?
- What is the interface for various move operations (slide, up and over) and for route/ripup operations?
- Would donut menus be useful?
- What is the interface for zooming and panning? How does it work on a touch device? How do we distinguish between moving a component and moving the viewport?
- Possibly: have an option to do AoE-style panning?
- Should there be some way to work with multiple boards? E.g. tabbed interface.

### Schematic Description Language

- A formal specification and interpreter/DSL for the Schematic Description Language.
- A code editor (ace?) for SDL files.
- A method to safely interpret SDL client-side. Perhaps using a web worker?
- A library of packages and components, with a simple way to create new ones.

### Import/Export

- A formal specification of an intermediate representation for boards. This should be designed so that it is human-readable and suitable for version control.
- A method to load a file from intermediate form into the editor, and vice versa.
- A method to convert between intermediate form and Eagle ``.brd`` files, perhaps with topographic simplification when translating from Eagle files to intermediate form.
- A method to convert from intermediate form to gerber files.

### History and Version Control

- All actions should be synced to the server, so that there is 'infinite undo'.
- Investigate operational transforms: they might be a good way of recording actions.
- A method for quickly viewing the board state at different times in history. Perhaps a slider bar?
- The ability to retroactively tag particular board states as important.
- A method for handling branches and merging.
- Integration with github. Checkout, commit, merge, push. This requires a backend and UI.

### User accounts

- Private and public projects
- Real-time collaboration, using operational transforms.
- Anonymous editors and read-only URLs.
- Organisations, with user management.
- Shared projects (no single person owns it). Principle use case: assignments.

### Advanced features

- An autorouter, or at least one that will auto-complete the current track.
- Grey out paths which cannot be taken (e.g. if there's an impassable cut).
- Draw tracks in rectilinear form, while still being able to push them aside etc.
- If a pad has straight edges, tracks should leave at right angles to the edge.
- A method to enforce minimum curve radii, perhaps with the ability to specify minimum curve radii on a per-track basis.
- Optimise for minimum (least squares?) curve radii on a set of tracks.
- The ability to set properties and goals for each track, and see how each track performs. These properties and goals could also be used for autorouting. Perhaps an interface which displays which areas and tracks are likely to cause problems.

### Performance Optimisations

- Put as much code as possible into web workers, and have a lightweight UI thread.
- Allocate and recycle a pool of static objects. There would need to be different pools for different classes of objects.
- Minimise the number of SVG object in the DOM. Perhaps a tile-based renderer? It would be vital to quantify the performance improvement, if any.
- Perhaps it would be possible to simplify shapes when zoomed out? E.g. remove rounded corners, and join tracks together if they form a 'significant' bus.


### Miscellaneous

- A method to ensure that updating a SVG-backed object will adjust the SVG element, not replicate it.








