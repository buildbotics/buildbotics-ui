#Introduction to the Tool Path Language (TPL)

[TPL](tplang.org) is a programming language for creating machine tool paths for Computer Numerical Control (CNC). It is based on JavaScript and is a powerful replacement for the venerable but horribly outdated [g-code](http://reprap.org/wiki/G-code) language. However, [TPL](tplang.org) can output [g-code](http://reprap.org/wiki/G-code) so it remains compatible with existing machine control software like LinuxCNC.

The purpose of this tutorial is to provide enough basic information for you to get started using TPL.  We will use TPL to generate the [g-code](http://reprap.org/wiki/G-code) necesarry to cut a simple 2-dimensional shape, and simulate the result using the [Camotics](openscam.org) simulator.

This tutorial assumes that you have installed [Camotics](openscam.org) and the tplang command is available in your path.  If not, go to the [Camotics](openscam.org) web site and follow the download and installation instructions.

##Step-by-Step Instructions
These steps are performed on a Debian Linux system.  They should be very similar on all systems, but you may have to adlib a bit to get it exactly right on your system.  You may want too open the (TPL)[

1. Make a folder for your testing and move into it:
```
$ mkdir tpl_tutorials
$ cd tpl_tutorials
```
2. Open up your favorite text editor.  (I use gedit on linux machines and notepad++ on windows machines.)  If your text editor supports languages, configure it for Javascript.  Since TPL is an extension of Javascript, you will benefit from the syntax highlighting for Javascript.
3. From within your text editor create a new file called tpl_tutorial1.tpl and save it in the tpl_tutorials folder that you created in step 1.
