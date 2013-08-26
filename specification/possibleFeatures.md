
Possible Features
=================

The purpose of this document is to list all the possible features or units of functionality that could be implemented. This is just a brainstorming exercise; it doesn't mean that these features will ever be found in the final product.

First, some vocabulary:

A _track_ is a line which (in the finished board) will be used to carry an electrical signal between pins. The _active track_ is the track which is currently being routed.

An _obstacle_ is anything which a track cannot cross and which the track must avoid. For example, a pad or a drill hole. Obstacles are initally represented by circles, but in a realistic board most obstacles will be compound shapes formed from many smaller circles.

A _wrap_ is a curved segment of track, and a _stretch_ is a straight segment of track. Wraps are always centered on obstacles.

A _trigger line_ is an imaginary line which, if crossed with the mouse, will cause the editor to wrap the current track around the associated obstacle.



### Routing Tracks

- A method for determining the stretch and wrap when a line is routed around two obstacles, for given wrap radii and wrap directions.
- A method to calculate trigger lines, and determine when the mouse crosses one.
- Hanging tracks: when a user undos the most recent wrap, the exposed stretch should be shortened to an appropriate length, and perhaps rotated so that it doesn't affect other tracks.
- A method to recalculate wraps when a component is moved.
- A method to calculate the cascading impact of a particular change, such as routing a track inside a pre-existing wrap.
- A method to negotiate wrap order and radius, with an obvious focus on avoiding 'impossible' wraps.
- A method to enforce minimum curve radii, perhaps with the ability to specify minimum curve radii on a per-track basis.
- Joining tracks: what is the UX? What is the form of a join? Can we afford to have curved joins, considering that they will require polygons and not just paths?
- A method for determining which critical cuts are impassable.
- More generally, a method for determining keep-out regions, including those around obstacles from a different net.
- What happens when the user moves their mouse over a keep-out region?
- What is the UX for beginning/pausing/completing a route?
- A method for pushing tracks aside. This will probably involve creating a 'virtual' obstacle at the head of the active track.

### Compound Obstacles

- A logical MVC structure
- A method for wrapping tracks around compound obstacles.

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










