#Introduction to the Tool Path Language (TPL)

[TPL](http://tplang.org) is a programming language for creating machine tool paths for Computer Numerical Control (CNC). It is based on JavaScript and is a powerful replacement for the venerable but horribly outdated [g-code](http://reprap.org/wiki/G-code) language. However, [TPL](http://tplang.org) can output [g-code](http://reprap.org/wiki/G-code) so it remains compatible with existing machine control software like [LinuxCNC](http://www.linuxcnc.org).

The purpose of this tutorial is to provide enough basic information for you to get started using [TPL](http://tplang.org).  We will use [TPL](http://tplang.org) to generate the [g-code](http://reprap.org/wiki/G-code) necesarry to cut a simple 2-dimensional shape, and simulate the result using the [Camotics](http://openscam.org) simulator.

This tutorial assumes that you have installed [Camotics](http://openscam.org) and the tplang command is available in your path.  If not, go to the [Camotics](http://openscam.org) web site and follow the download and installation instructions.  [TPL](http://tplang.org) is included in the [Camotics](http://openscam.org) distribution.

##Step-by-Step Instructions
These steps are performed on a Debian Linux system.  They should be very similar on all systems, but you may have to adlib a bit to get it exactly right on your system.  You may want to open the [TPL](http://tplang.org) web site in a separate window to get more information about the commands used during the tutorial.

1. Make a folder for your testing and move into it:

  ```
  $ mkdir tpl_tutorials
  $ cd tpl_tutorials
  ```
2. Open up your favorite text editor.  (I use gedit on linux machines and notepad++ on windows machines.)  If your text editor supports languages, configure it for Javascript.  Since TPL is an extension of Javascript, you will benefit from the syntax highlighting for Javascript.
3. From within your text editor create a new file called tpl_tutorial1.tpl and save it in the tpl_tutorials folder that you created in step 1.
4. Enter units(METRIC) for the first line.  Units can either be METRIC or IMPERIAL.  We will use METRIC for this tutorial.  As a result the distances entered will be in millimeters and the resulting [g-code](http://reprap.org/wiki/G-code) distances will also be in millimeters.

  ```
  units(METRIC);
  ```
5. Set the cutting speed to 400 mm per minute.  This is the maximum speed at which the cutting head will travel through the workpiece material.

  ```
  feed(400);
  ```
6. Select tool number 1.  This will cause tool 1 to be used in [Camotics](http://openscam.org) and by your CNC machine.

  ```
  tool(1);
  ```
7. Tell the spindle to spin at 2000 revolutions per minute

  ```
  speed(2000);
  ```
8. Initiate a rapid movement to a height of 5 mm.  Rapid moves are used when the machine is not cutting material.

  ```
  rapid({z: 5});
  ```
9. With the cutting head now safely 5 mm above the workpiece surface, you can now initiate another rapid move to x = 1 mm and y = 1 mm.

  ```
  rapid({x: 1, y: 1});
  ```
10. Now drop the head 3 mm into the material.  Notice that we will use the cut command because we will be cutting as the head drops into the workpiece.

  ```
  cut({z: -3});
  ```
11. Now make four cuts forming a 10 mm square.

  ```
  cut({x: 11});
  cut({y: 11});
  cut({x: 1});
  cut({y: 1});
  ```
12. Move the cutting head to a safe position 5 mm above the workpiece surface and stop the spindle by setting it to 0 rpm.  Finally, we print M2 and a carriage return to the standard output.  M2 is a g-code command that means "end of program".  At the present time, TPL does not have an "end()" statement and some versions of LinuxCNC will fail if this statement is not included.

  ```
  rapid({z: 5});
  speed(0);
  print('M2\n');
  ```
Here's a screen shot of what your program should look like at this point.
  <img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/tpl_tut1_1.png" height="320" width = "480">

13. Now, you can see the [g-code](http://reprap.org/wiki/G-code) that this program generates by entering the following command at the command prompt in our tpl_turorials directory.  You may also get a warning about using a non-existent tool, which you can ignore.

  ```
  $ tplang tpl_tutorial1.tpl
  G21
  F400
  G0 Z5
  G0 X1 Y1
  M3 S2000
  G1 Z-3
  G1 X11
  G1 Y11
  G1 X1
  G1 Y1
  G0 Z5
  M5
  M2
  %
  ```
Hmmmm, you might notice that we just wrote 13 lines of [TPL](http://tplang.org) to get 14 lines of [g-code](http://reprap.org/wiki/G-code), so what's the point; and you might as well have just written the program in [g-code](http://reprap.org/wiki/G-code).  This is true for a simple program like this.  Recall however, that [TPL](http://tplang.org) is an extension of Javascript and all of the power of Javascript programming is now available to create complex shapes that you could not consider with [g-code](http://reprap.org/wiki/G-code) alone.

14. Now type the same command again, but redirect the output to a text file with a .ngc extension so it can be used by your CNC machine and by the [Camotics](http://openscam.org) simulator.

  ```
  $ tplang tpl_tutorial1.tpl > tpl_tutorial1.ngc
  ```
15. Finally, open up the [Camotics](http://openscam.org) simulator, load tpl_tutorial1.ngc, run the simulation, and you should get the following image.

  <img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/tpl_tut1_2.png" height="320" width = "480">

In the next few tutorials I will show how [TPL](http://tplang.org) can use it's Javascript roots to create some complex and interesting shapes.

On a final note, Buildbotics LLC is committed to the exchange of information for the betterment of small-scale manufacturing.  Your comments on this tutorial are welcome.  Please send me an e-mail message at dougcoffland@gmail.com if you would like to submit a tutorial of your own.

  
  
