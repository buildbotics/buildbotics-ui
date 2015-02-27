#Workflows for CNC Designs
##Introduction
I've been playing around with CNC routers for a couple of years now and may actually be able to call myself an "advanced-beginner hobbiest".  It's not much of a title, but I've come a long way and it seems like I may be able to help others reach such an honerable status with a little less time and effort.

I started out by building a CNC router in my garage.  There's quite a bit of good information on the web about how to do that, and I wouldn't recommend that anyone do what I did, so I won't attempt to explain it.  Even still, after quite a few weeks of effort and about $900 spent, I actually had a CNC router in my garage.

Once it was built, I loaded Linux on an old computer and proceeded to install [LinuxCNC](linuxcnc.org).  After some fiddling around, I had it working, and was actually able to cut out the words "LinuxCNC" in nice italic font.  After the euforia wore off, I began to wonder how they managed to create the example file, and more importantly how I might be able to create my own.

Being at least as tight as the average DIY hobbiest, I began to dig around on internet to try to find some free software that would allow me to create designs.  I had high hopes of being able to create 3D carvings, and all sorts of other stuff.  I did not know how difficult it was going to be to get all the pieces together to actually do anything meaningful with my cool new toy.  It's good thing too, because if I had, I probably would not be writing this article at all.

As the title of the document suggests, I'm going to describe workflows.
##What do you mean by workflow, you ask
I'm glad you asked, because when I started I don't think I knew either.  Even if you do know, for the purpose this article, workflow means the series of tasks that have be completed to turn a conception into a finished product.  When I started, I had the vision that a single workflow would solve most (hopefully all) of my needs and set out to get the free software that would fill this vision.

At the highest level, my vision was already met and I decided that my workflow would be:

1. Design - I would use a free Computer Aided Design (CAD) software package to create my designs.
2. Convert Design to machine control language - This was the mysterious step that I began to know as Computer Aided Manufacturing or CAM for short.
3. Cut - This was the last step where I would actually cut out the thing that I had originally envisioned.

After a few head crashes and quite a bit of wasted material, I realized that I needed to simulate the design before sending it to my router, so I added a step between steps 2 and 3.  So, to me (and you while reading this article) workflow means:

1. Design
2. Covert
3. Simulate
4. Cut

This is a classic example of something that sounds good if you say it fast.  The trouble is that finding free software that does all of these things is a tall order.

##What tools should I use?
It reminds me of when I went out to buy my first computer back in 1981 (yes, I'm old) and the computer salesman (who knew even less than me) asked "Well, what do you want to do with your computer?"  I didn't have a good answer because I didn't know what a computer could do.  Basically, I wanted to fiddle around and show off cool things to my friends, but I wasn't ready to admit that since I was getting ready to shell out $3000 for a computer with two floppies and 192K of RAM.  Unfortunately, that same silly question applies when you select your workflow tools.

So,if your goal is to cut out basically flat shapes in two dimensions,  you're in luck because there are some pretty good tools for doing just that.  There are others, but I like [Inkscape](www.inkscape.org).  You can add on a plug-in called [Gcodetools](http://www.cnc-club.ru/forum/viewtopic.php?t=35#p65) that allows creating [g-code](http://en.wikipedia.org/wiki/G-code) from within Inkscape.  G-code is the language that [LinuxCNC](linuxcnc.org) and most other CNC drivers use.  The CNC driver actually converts the [g-code](http://en.wikipedia.org/wiki/G-code) to the electrical signals used by your CNC hardware.  Finally, I discover that [Cambotics](OpenSCAM.org) is a great tool for simulations.  So for simple 2D designs, I actually had a working workflow:

1. Design - Using Inkscape
2. Convert - Gcodetools plug-in for Inscape
3. Simulate - Cambotics
4. Cut - LinuxCNC with my home made CNC router

But I was pretty impatient and wanted to do more.  I was still jealous of the cool output from the [LinuxCNC](linuxcnc.org) example and wanted to be able to cut out text in nifty fonts.  I actually went off on my own and wrote a python script that would read bitmap files created by Paint and other programs.  The python script was pretty cool, but I could not get the text to be just right.  Then, I discovered [Hershey Text](http://www.evilmadscientist.com/2014/hershey-text-js/) and learned that there was a [Hershey Text Plug-in](http://www.evilmadscientist.com/2011/hershey-text-an-inkscape-extension-for-engraving-fonts/).  Viola, my jealous envy of the [LinuxCNC](linuxcnc.org) example program was over.  Using [Inkscape](www.inkscape.org) with [Gcodetools](http://www.cnc-club.ru/forum/viewtopic.php?t=35#p65) and [Hershey Text ](http://www.evilmadscientist.com/2011/hershey-text-an-inkscape-extension-for-engraving-fonts/) plug-ins, I was able to create the "No Soliciting Please" sign that's hanging outside my door.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/No_Soliciting.jpg" height="320" width = "480">

With the hoards of solicitors no longer coming to my door, I have even more time to spend working on CNC stuff.  My workflow became:

1. Design - Inscape with the Hershey Text plug-in
2. Convert - GCodetools from within Inscape
3. Simulate - Cambotics
4. Cut - LinuxCNC and my home made router.

I still wasn't satisfied, because I had dreamed of being able to cut out 3D objects.  In the mean time, my built-in refrigerator broke down and it became obvious that I needed to replace it.  I quickly found out that built-in refrigerators are really expensive.  My cheapskate genes took over, and I learned that I could by a "panel-ready" refrigerator and save about 1500 bucks.  "Panel-ready" means that the front of the fridge is just bare metal with some big funky handles.  It was not something that my wife was willing to put up with for long.

It seemed that the panels weren't going to be too hard, but the handles were a completely different story.  I looked around for some handles to buy, and found that they cost about $600 for a pair.  It was time.  I now had to get the 3D routing figured out so I could make handles for my refrigerator.  There may be others, but the only free 3D package that could output [g-code](http://en.wikipedia.org/wiki/G-code) directly was [HeeksCAD](https://sites.google.com/site/heekscad/).  I wanted a long, sleek design for my handles and couldn't figure out how to make such a design using [HeeksCAD](https://sites.google.com/site/heekscad/).  I did, learn how to use the [g-code](http://en.wikipedia.org/wiki/G-code) generator from within [HeeksCAD](https://sites.google.com/site/heekscad/).

Next, I decided to give [OpenSCAD](www.openscad.org) a try.  [OpenSCAD](www.openscad.org) was a little intimidating, because you have to actually write code that generates the model, but I gave it a try and it worked out.  Here's a screen shot of the program and the 3D design in [OpenSCAD](www.openscad.org). Yep, it's only about 50 lines of code.  The code is pretty high-level and fairly easy to learn.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/OpenScadHandle.png" height="320" width = "480">

Unfortunately, [OpenSCAD](www.openscad.org) doesn't output [g-code](http://en.wikipedia.org/wiki/G-code) directly.  It does output STL files and [OpenSCAD](www.openscad.org) can read STL files.  So using the following workflow, I was able to create some really nice handles for my refrigerator.

1. Design - OpenSCAD
2. Convert - HeeksCAD
3. Simulate - Cambotics
4. Cut - LinuxCNC and my home made CNC router

Here a picture of my fridge.  My wife is quite happy, and I suppose that's what really matters.
<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/fridge.jpg" height="320" width = "480">

This workflow still has a few problems and limitations.  For instance, as the design grows, the processing times for both [OpenSCAD](www.openscad.org) and [HeeksCAD](https://sites.google.com/site/heekscad/) seem to grow exponentially.  At some point, the complexity of the design has to give way to the amount of time it takes to process it.  [HeeksCAD](https://sites.google.com/site/heekscad/) seems to have a few bugs.  It's written in python, and fortunately I was able to find a couple of recommended patches to get me through this project.  I chose to use a raster-style (back and forth cutting pattern) and the cuts were not evenly spaced.  This cause difficulty while cutting.  I also found that [HeeksCAD](https://sites.google.com/site/heekscad/) tended to put a hole in the cut in unpredictable places. Fortunately, [Cambotics](OpenSCAM.org) is able to pick up on these problems before cutting begins.  Finally, I still want to combine as many steps into a single package as possible.

##My Latest Endeavor
One of the first things I wanted to do when I started CNC routing was to be able to take photographs and cut them out in wood.  How naive I was.  Nevertheless, I still want to do it.

I discovered that [Cambotics](OpenSCAM.org) comes with a few additional command-line tools.  One of those tools is [TPLang](www.tplang.org), which is a javascript extension with some cutting capabilities built in.  I haven't really written much javascript before, but it's an excellent, easy-to-learn language.  I've written a few programs so far, and it looks very promising.  One of those programs is a cut of my old baby picture.  I haven't actually cut it out, but [Cambotics](OpenSCAM.org) simulations look good.  Here's the workflow for the baby picture:

1. Design - I used [Inkscape](www.inkscape.org) to draw a polygon around the profile of the baby in the picture and save the profile to a DXF file from [Inkscape](www.inkscape.org).  I wrote a c++ program that reads the original picture and converts the raster pixel images to a JSON file.  Both dxf and JSON files are readable from tplang.  Then I created the design using TPLang.
2. Convert - TPLang outputs g-code directly
3. Simulate - [Cambotics](OpenSCAM.org) is able to simulate either g-code or TPlang.
4. Cut - LinuxCNC and my home made CNC router.

I haven't actually cut out the baby yet, here is a picture of the [Cambotics](OpenSCAM.org) simulation.




