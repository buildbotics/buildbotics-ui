#Cutting Text With Line Fonts
This tutorial demonstrates how to cut a text string.
##Software used
The following software was used and it is assumed that the software is already installed and path variables are configured.
* [Tool Path Language (TPL)](http://tplang.org)
* [Camotics](http://openscam.org)
* [LinuxCNC](http://linuxcnc.org)

##Step 1 - Write TPL Program
Using your favorite text editor, ceate a file called TextOnWood.tpl in the directory where you plan to work.  Configure it for Javascript if it supports languages, enter the following lines of text and save your work:
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

for (var i = 0; i < line.paths.length; i++) {
  pathToCut.path = line.paths[i];
  cutter.cutPath(pathToCut);
};
```
The following is an explanation of the code you just entered.  It provides details of exactly what each line does.  You can skip to Step 2 if you don't need an explanation.
* The first four lines are the libraries that must be included.  We will only make calls to functions in the [HersheyTextAids Library](https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md) and the [CuttingAids Library](https://github.com/buildbotics/tpl-docs/blob/master/Cutting%20Library.md).  The HersheyTextAids Library depends on the hersheytext library so the hersheytext library must be included. Similarly, the CuttingAids Library depends on the ClipperAids Library,
so it must be included as well
* The next four lines are general set up and have the following meaning:
  * Units will be in millimeters
  * The cutting feed rate will be .8 meters per minute.  Note that the router may induce limitations that cause the cutting speed to be slower. If your router cuts faster, feel free to change this speed.  This is what mine will do reliably.
  * The spindle will turn at 4000 rpm.  Actually, mine is a fixed speed and is unaffected by this parameter.  Nevertheless, it should be here for those of you with more sophisticated machines than mine and you can set it to a speed that you are comfortable with.
  * Tool 1 will be used.  As a result, you will want to configure tool 1 in the Camotics simulator and in the LinuxCNC router.  Note, this line is really not necessary since both the Camotics simulator and LinuxCNC will default to using tool1, if it is not specified.

* In the next three lines, we configure an object with the parameters of our cut and pass that object to the getLineOfText function in the HersheyTextAids library object, which was assigned to the ha variable in the second line of code above. We'll name our object "line" and configure it with the following information:
  * The text to be cut will be "Hello World!"
  * The character spacing will be -2, which squeezes the text together from the standard spacing defined in the HersheyText library.  This is necessary since we will be using a cursive script and we want the letters to connect together.
  * Multiply the size of the resulting fonts by the scale factor, which is two.  Note, that the actual size of the fonts in the hersheytext library vary somewhat, and you may have to play around with this to get the size of text that you actually want.
  * Set the font to "Script 1-stroke".  You can use any font you like from the list defined in the HersheyTextAids Library documentation found at https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md Those fonts with names ending with "-stroke" are single line fonts and work best for CNC routing.
  * Finally, set the space size (the distance between words) to 5 millimeters times the scale factor.  Since our scale factor is 2, each word will be 10 mm apart.
* Next we must create an object with the rapid movement cutting height (safeHeight) and the cutting depth (depth) to be passed tothe cutPath functionn in the CuttingAids Library object, which was set to cutter in the fourth line of code.  safeHeight will be 3 mm and depth will be 6 mm.
* Finally, for each path that was created in the ha.getLineOfText function call above, we will set the path property in the pathToCut object to that line and then pass the pathToCut object to the cutter.cutPath function to actually create the g-code for the cut.

##Step 2 - Convert TPL Program to g-code
This step convert the TPL program that we just entered to a g-code file named TextOnWood.nc.

Move to your working directory and enter the following command.
```
$ tplang TextOnWood.tpl >> TextOnWood.nc
```
##Step 3 - Open Camotics simulator and load g-code
Open up the Camotics simulator and select "Open Project" from the File menu.  Browse to your working directory, select TextOnWood.nc and click Open.

##Step 4 - Configure tool 1 in Camotics
* Click the "Tool View" tab just above the display window
* Set the settings section to the followiing parameters:
   * Tool     1
   * Units    mm
   * Shape    Conical
   * Length   7.9375
   * Diameter 9.525
This creates a bit that will cut a 90 degree angle up to 5/16 in deep. 
  
##Step 5 - Run the Camotic simulation
Click the "Simulation View" tab and then hit the F5 key to run the simulation.  The results should look like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/CuttingTextWithFonts/Camotics_Simulation.png" height="300" width = "400">
