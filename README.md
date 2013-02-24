Music Representation
=============

In short, a pet project gone horribly wrong, and extendeding far beyond what I had wanted at first. Wanting to teach myself a bit of Javascript and Html5, I decided to make something that would help me. I have difficulties reading sheet music at a decent speed, so I decided to make a small program that would randomly generate notes for me to play, with a variable speed. That way I could use it for practice and improve my piano skills.

However, now it has become a quest to create a Generic Musical Staff object which will be flexible for any use (displaying chords/notes, loading and playing MusicXML files, etc). Forgive me for any bad code, I'm new to JS and I'm really stuck in a C# mind, but hopefully it'll end up good.

For lack of better place to put it, I'll put some of my plans here.

Generic Musical Staff Object
--------------
I want everything inside this object to be toggle-able. If I want to display only the notes (no staff lines), I should be able to do that. If I want to display everything, then that should be possible. These staffs should be able to be paused, played, dragged-through, cleared, loaded from MusicXML, everything, handled from outside the object. The Generic Musical Staff object shall not have any logic, only the capability to be dynamic. Other scripts will have to be written to use the Generic Musical Staff properly.
