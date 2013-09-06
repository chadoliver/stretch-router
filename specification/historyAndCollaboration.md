#### For storage and collaboration, what constitutes an 'action'? Is this compatible with Operational Transforms?


----------------------------------------------------------------------------------------------------
#### How do we indicate that an action is one part of an ongoing compound action?


----------------------------------------------------------------------------------------------------
#### How do we prevent edit conflicts? Should we attach mutexes to each track and obstacle?


----------------------------------------------------------------------------------------------------
#### How do we indicate that a collaborator is editing a particular component?


----------------------------------------------------------------------------------------------------
#### What happens when a collaborator leaves their computer half-way through an action? Does their edit mutex expire?


----------------------------------------------------------------------------------------------------
#### Should we allow branches? If so, how should we implement them?


----------------------------------------------------------------------------------------------------
#### Do OT messages need to go through a central server? Can we use peer-to-peer messaging?


----------------------------------------------------------------------------------------------------
#### How can we allow users on different servers to collaborate?

(An aside: this is a nice-to-have feature that probably won't make it into the first few releases).

Vulcan will be open-source. Users should be able to easily clone the project, and run it over ``localhost``. However, it would be stupid if users could only collaborate and interact with other users on their own server. If John Smith and Jane Doe are each running their own servers, they should be able to interact as if they were both on the same server. Walled gardens are ideologically incompatible with open source.

[How can users find each other? What is the network hierarchy? How do we decide which server is the master? How do we make the protocol tolerant to the master dropping out?]

There seems to be two ways of structuring the data flow. The first is for all clients to connect to a chosen 'master' server. This server would maintain synchronisation, then echo the changes to all the other servers (the 'slaves'). The purpose of the echo messages is simply to keep all slaves up to date; the slaves would only communicate with their clients if the master went offline.

The second method is for each user's client to interact with their server, and for the servers to negotiate all synchronisation between themselves. There will still be a single master server, but from each _client's_ point of view their own server is the master. This method would mean that synchronisation messages are triple-handled, but on the other hand it would reduce the inter-computer bandwidth when each user is running a server on ``localhost``.

Both methods require that each server is able to emulate a client sending sync messages. 

(To be continued ...)


----------------------------------------------------------------------------------------------------
#### What is the UI for the history slider?


----------------------------------------------------------------------------------------------------
#### How do we implement real-time and/or retrospective tagging of particular board states?


----------------------------------------------------------------------------------------------------
#### What impact does the OT/Collaboration messages have on the achitecture of the BoardState object and infinite undo?


----------------------------------------------------------------------------------------------------
#### What impact does all of this have on the wider program architecture?


