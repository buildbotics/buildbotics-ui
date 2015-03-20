#How to cut text using the TPL HersheyText Aids Library
This lesson demonstrates how to write a [TPL](http://tplang.org) program that creates the [g-code](http://reprap.org/wiki/G-code) for a text string using the [HersheyText Aids TPL Library](https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md).

##Step 1 - Write TPL Program
Using your favorite text editor, ceate a file called text.tpl in the directory where you plan to work.  Configure it for Javascript if it supports languages.

##Step 2 - Include the necessary libraries
We will use the HersheyTextAids.js and the [CuttingAids.js](https://github.com/buildbotics/tpl-docs/blob/master/Cutting%20Library.md) libraries directly.  The HersheyTextAids.js library references the hersheytext.js, which was created by the [Evil Mad Scientist Laboratories](http://www.evilmadscientist.com/2014/hershey-text-js/), so we have to include it as well.  In addition the [CuttingAids.js Library](https://github.com/buildbotics/tpl-docs/blob/master/Cutting%20Library.md) references the [ClipperAids.js library](https://github.com/buildbotics/tpl-docs/blob/master/Clipping%20Library.md) so the ClipperAids.js library has to be included along with the CuttingAids.js library.  Enter the first four lines into your text editor to provide these library inclusions.

```
var hf = require('hersheytext');
var ha = require('HersheyTextAids');
var ca = require('ClipperAids');
var cutter = require('CuttingAids');
```

##Step 3 - Cutting Setup
The next four lines are general set up and have the following meaning:
* Units will be in millimeters
* The cutting feed rate will be .8 meters per minute.  Note that the router may induce limitations that cause the cutting speed to be slower. If your router cuts faster, feel free to change this speed.  This is what mine will do reliably.
* The spindle will turn at 4000 rpm.  Actually, mine is a fixed speed and is unaffected by this parameter.  Nevertheless, it should be here for those of you with more sophisticated machines than mine and you can set it to a speed that you are comfortable with.
* Tool 1 will be used.

```
units(METRIC);
feed(800);
speed(4000);
tool(1);
```

##Step 4 - Create paths for the text
In the next three lines, we configure an object with the parameters of our cut and pass that object to the getLineOfText function in the HersheyTextAids library object, which was assigned to the ha variable in the second line of code above. We'll name our object "line" and configure it with the following information:
  * The text to be cut will be "Hello World!".  You can enter any single line of text that you like here.  I chose "Hello World!
  * The character spacing will be -2, which squeezes the text together from the standard spacing defined in the HersheyText library.  This is necessary since we will be using a cursive script and we want the letters to connect together.
  * Multiply the size of the resulting fonts by the scale factor, which is two.  Note, that the actual size of the fonts in the hersheytext library vary somewhat, and you may have to play around with this to get the size of text that you actually want.
  * Set the font to "Script 1-stroke".  You can use any font you like from the list defined in the [HersheyTextAids Library documentation]( https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md). Those fonts with names ending with "-stroke" are single line fonts and work best for CNC routing.
  * Finally, set the space size (the distance between words) to 5 millimeters times the scale factor.  Since our scale factor is 2, each word will be 10 mm apart.
  * When ha.getLineOfText(line) returns, line will contain a new property (line.paths) which contains the paths that form our line of text.

```
var line = {text: "Hello World!", spacing: -2, scale: 2,
            font: "Script 1-stroke", spaceSize: 5};
ha.getLineOfText(line);
```

##Step 5 - Cut the paths
First, we must prepare an object to be used as the argument for cutter.cutPath().  We do this by creating the pathToCut object and setting the rapid movement height (safeHeight) to 3 mm and the cutting depth (depth) to 6 mm.  Then we repeatedly assign each path in the line.paths property to the pathToCut.path property and call cutter.cutPath.  Cutter is an object that was created in line 4 and it contains the cutPath method.

Add the following four lines of code in your text editor.

```
var pathToCut = {safeHeight: 3, depth: 6};
for (var i = 0; i < line.paths.length; i++) {
  pathToCut.path = line.paths[i];
  cutter.cutPath(pathToCut);
};
```

##Step 6 - Add the end statement.
Add the 'end of program' statement (M2) to the end of your program.

```
print('M2\n');
```
At this point your entire program should look like this:

```
var hf = require('hersheytext');
var ha = require('HersheyTextAids');
var ca = require('ClipperAids');
var cutter = require('CuttingAids');
units(METRIC);
feed(800);
speed(4000);
tool(1);
var line = {text: "Hello World!", spacing: -2, scale: 2,
            font: "Script 1-stroke", spaceSize: 5};
ha.getLineOfText(line);
var pathToCut = {safeHeight: 3, depth: 6};
for (var i = 0; i < line.paths.length; i++) {
  pathToCut.path = line.paths[i];
  cutter.cutPath(pathToCut);
};
print('M2\n');
```

##Step 7 - Convert TPL Program to g-code
This step converts the TPL program that we just entered to a g-code file named text.ngc.

Move to your working directory and enter the following command.
```
$ tplang TextOnWood.tpl > text.ngc
```
##Step 8 - Simulate the result in Camotics

Open up the Camotics simulator and select "Open Project" from the File menu.  Browse to your working directory, select text.ngc and click Open.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/HersheyText_Lesson1/Camotics_Simulation.png" height="300" width = "400">

