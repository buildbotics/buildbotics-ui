#Introduction to the Tool Path Language (TPL)

[TPL](http://tplang.org) is a programming language for creating machine tool paths for Computer Numerical Control (CNC). It is based on JavaScript and is a powerful replacement for the venerable but horribly outdated [g-code](http://reprap.org/wiki/G-code) language. However, [TPL](http://tplang.org) can output [g-code](http://reprap.org/wiki/G-code) so it remains compatible with existing machine control software like [LinuxCNC](http://www.linuxcnc.org).

The purpose of this tutorial is to provide enough basic information for you to get started using [TPL](http://tplang.org).  We will use [TPL](http://tplang.org) to generate the [g-code](http://reprap.org/wiki/G-code) necesarry to cut a simple 2-dimensional shape, and simulate the result using the [Camotics](http://openscam.org) simulator.

This tutorial assumes that you have installed [Camotics](http://openscam.org) and the tplang command is available in your path.  If not, go to the [Camotics](http://openscam.org) web site and follow the download and installation instructions.  [TPL](http://tplang.org) is included in the [Camotics](http://openscam.org) distribution.

##Step-by-Step Instructions
These steps are performed on a Debian Linux system.  They should be very similar on all systems, but you may have to adlib a bit to get it exactly right on your system.  You may want too open the [TPL](http://tplang.org) in a separate window to get more information about the commands used during the tutorial.

1. Make a folder for your testing and move into it:
  ```
  $ mkdir tpl_tutorials
  $ cd tpl_tutorials
  ```
2. Open up your favorite text editor.  (I use gedit on linux machines and notepad++ on windows machines.)  If your text editor supports languages, configure it for Javascript.  Since TPL is an extension of Javascript, you will benefit from the syntax highlighting for Javascript.
3. From within your text editor create a new file called tpl_tutorial1.tpl and save it in the tpl_tutorials folder that you created in step 1.
4. Enter units(METRIC) for the first line.  Units can either be METRIC or IMPERIAL.  We will use METRIC for this tutorial.  As a result the distances entered will in millimeters and the resulting [g-code](http://reprap.org/wiki/G-code) distances will be in millimeters.
  ```
  units(METRIC)
  ```
5. 
