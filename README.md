Vulcan
==================

Vulcan is an online PCB editor. Most other editors use a grid-based routing system, but Vulcan uses a funky topographic 
algorithm for routing the traces. (Think of rubber bands stretched around obstacles like pads or other traces.) As a 
pleasant side effect, using topographic routing should also allow me to implement cool stuff like push-aside routing 
and auto-complete. 


#### Why Use Topographic Routing?

Almost all PCB editors available today use grid-based routing. Vertices can only be placed in discrete locations, and tracks change direction in 45° or 90° increments. Here's what you see when editing a board in Eagle PCB:

![Eagle PCB](http://chadoliver.github.io/vulcan/images/gridrouter.png)

The biggest problem with grid-based routing is that it confuses form (the exact position of each track segment) with function ("make the track go between these two components, then clockwise around this pin"). In contrast, topographic routing only allows the user to specify function; the position of each track segment is controlled entirely by the editor. This makes it very easy to refactor the PCB.


#### Current Status

At the moment I've stopped all coding, and instead I'm focusing on writing a solid specification document. I've worked on a few projects in the past where I spent most of my time refactoring old code. _This_ time around I want to do it (mostly) right the first time.

Even though I'm not writing code at the moment, fleshing out the spec has forced me to solve a lot of gnarly algorithm challenges. I'm especially proud of [this solution](https://github.com/chadoliver/vulcan/blob/master/specification/routing.md#how-do-we-negotiate-wrapping-for-tracks-which-wrap-around-the-same-obstacles).

A few weeks ago, I also spent some days playing around with the algorithm for wrapping a track around circular obstacles. This is the (tiny) core of the whole program, and I am proud to announce that _it works_:

![Test image for track wrapping](http://chadoliver.github.io/vulcan/images/wrapped_track.png)


