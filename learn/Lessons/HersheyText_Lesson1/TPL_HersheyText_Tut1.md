#How to cut text using the TPL HersheyText Aids Library
This lesson demonstrates how to write a [TPL](http://tplang.org) program that creates the [g-code](http://reprap.org/wiki/G-code) for a text string using the [HersheyText Aids TPL Library](https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md).

##Step 1 - Write TPL Program
Using your favorite text editor, ceate a file called text.tpl in the directory where you plan to work.  Configure it for Javascript if it supports languages.

##Step2 - Include the necessary libraries
We will use the HersheyTextAids.js and the [CuttingAids.js](https://github.com/buildbotics/tpl-docs/blob/master/Cutting%20Library.md) libraries directly.  The HersheyTextAids.js library references the hersheytext.js, which was created by the [Evil Mad Scientist Laboratories](http://www.evilmadscientist.com/2014/hershey-text-js/), so we have to include it as well.  In addition the [CuttingAids.js Library](https://github.com/buildbotics/tpl-docs/blob/master/Cutting%20Library.md) references the [ClipperAids.js library](https://github.com/buildbotics/tpl-docs/blob/master/Clipping%20Library.md) so the ClipperAids.js library has to be included along with the CuttingAids.js library.  Enter the first four lines into your text editor to provide these library inclusions.

```
var hf = require('hersheytext');
var ha = require('HersheyTextAids');
var ca = require('ClipperAids');
var cutter = require('CuttingAids');
```

```
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

print('M2\n');
```

* The next four lines are general set up and have the following meaning:
  * Units will be in millimeters
  * The cutting feed rate will be .8 meters per minute.  Note that the router may induce limitations that cause the cutting speed to be slower. If your router cuts faster, feel free to change this speed.  This is what mine will do reliably.
  * The spindle will turn at 4000 rpm.  Actually, mine is a fixed speed and is unaffected by this parameter.  Nevertheless, it should be here for those of you with more sophisticated machines than mine and you can set it to a speed that you are comfortable with.
  * Tool 1 will be used.  As a result, you will want to configure tool 1 in the Camotics simulator and in the LinuxCNC router.  Note, this line is really not necessary since both the Camotics simulator and LinuxCNC will default to using tool1, if it is not specified.
* In the next three lines, we configure an object with the parameters of our cut and pass that object to the getLineOfText function in the HersheyTextAids library object, which was assigned to the ha variable in the second line of code above. We'll name our object "line" and configure it with the following information:
  * The text to be cut will be "Hello World!"
  * The character spacing will be -2, which squeezes the text together from the standard spacing defined in the HersheyText library.  This is necessary since we will be using a cursive script and we want the letters to connect together.
  * Multiply the size of the resulting fonts by the scale factor, which is two.  Note, that the actual size of the fonts in the hersheytext library vary somewhat, and you may have to play around with this to get the size of text that you actually want.
  * Set the font to "Script 1-stroke".  You can use any font you like from the list defined in the [HersheyTextAids Library documentation]( https://github.com/buildbotics/tpl-docs/blob/master/HersheyText%20Aids%20Library.md) Those fonts with names ending with "-stroke" are single line fonts and work best for CNC routing.
  * Finally, set the space size (the distance between words) to 5 millimeters times the scale factor.  Since our scale factor is 2, each word will be 10 mm apart.
* Next, we must create an object with the rapid movement cutting height (safeHeight) and the cutting depth (depth) to be passed to the cutPath function in the CuttingAids Library object, which was set to cutter in the fourth line of code.  safeHeight will be 3 mm and depth will be 6 mm.
* Then, for each path that was created in the ha.getLineOfText function call above, we will set the path property in the pathToCut object to that line and then pass the pathToCut object to the cutter.cutPath function to actually create the g-code for the cut.
* Finally, the last line of code terminates the program.  TPL automatically adds a % character at the end of each program, but this does not seem to work with LinuxCNC without adding the M2 (end of program command) ahead of the % sign.

##Step 2 - Convert TPL Program to g-code
This step converts the TPL program that we just entered to a g-code file named TextOnWood.ngc.

Move to your working directory and enter the following command.
```
$ tplang TextOnWood.tpl > TextOnWood.ngc
```
##Step 3 - Open Camotics simulator and load g-code
Open up the Camotics simulator and select "Open Project" from the File menu.  Browse to your working directory, select TextOnWood.ngc and click Open.

##Step 4 - Configure tool 1 in Camotics
* Click the "Tool View" tab just above the display window
* Set the settings section to the followiing parameters:
   * Tool     1
   * Units    mm
   * Shape    Conical
   * Length   7.9375
   * Diameter 9.525

This creates a bit that will cut a 90 degree angle up to 5/16" deep. 
  
##Step 5 - Run the Camotic simulation
Click the "Simulation View" tab and then hit the F5 key to run the simulation.  The results should look like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Camotics_Simulation.png" height="300" width = "400">

Save your work in a file called TextOnWood.xml.  This will be your project file and it includes the tool configuration we made as well as a reference to TextOnWood.ngc.  Use TextOnWood.xml to re-open this file if you want to make changes.  If you are satified with the appearance from the simulation move on to Step 6, otherwise go back to step 1 to adjust parameters and continue through step 5.  Rinse and repeat until it looks that way you want.

##Step 6 Open LinuxCNC and load TextOnWood.ngc
Open linuxCNC and select the configuration file for your router.

After LinuxCNC has opened, select "Open" from the file menu, browse to your working folder, select "TextOnWood.ngc, and open it.

##Step 7 Configure LinuxCNC Tool Table
Select "Edit tool table..." from the File menu. Select row number 1 and enter the following data on row 1.  Note, your data may differ depending on what tool you have available for this cut:
* Tool Column		1
* POC Column		1
* Z colum		0
* DIAM column		7.9
* Comment column	.375 x 5/16" conical bit
Then click "Write Tool Table File" and then click Dismiss

## Step 8 Turn on the router controller
Turn on your router controller. Then, press F2 to power on the controller.

##Step 9 Install Tool 1
Select the Z radio button and then click and hold the + button until the cutting head is high enough to change the tool. Put the 3/8 x 5/16" conical tool (or whatever you have available) into the spindle.

##Step 10 Secure Workpiece to Router Table
I use clamps.  Double sided tape works as well.  If you use clamps, make sure the router will not hit them during the cut.  Make sure the workpiece is square with the table and it is in a position that allows sufficient room to cut out the text phrase. Note, the text will be about 12 inches long and approximately 1.7 inches high, and will work from the origin at x=0,y=0.  These dimensions be found by selecting Properties from the File menu.

##Step 11 Home Axes
Move the head to where you want the lower left point of the first letter to be.  Then select the X radio button and click Home Axis, and do the same with the Y radio button.   Select the Z radio buttion.  Using the jog speed control to adjust the speed of manual movements and using the + and - controls, move the cutting head to the a point where it just touches the surface of the workpiece.  Then click home axis.

##Step 12 Set the maximum velocity
We set the cutting speed to 800 mm/minute in the TPL program.  That equates to 31.5 inches per minute.  Assuming your router can cut at this speed, set the maximum velocity to about 31.5 inches per minute using the slider control.

At this point, the machine is ready to start cutting.  The following images show how my machine looks and the state of LunuxCNC.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Router_Ready_To_Cut.jpg" height="300" width = "400">
<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/LinuxCNC_Ready_To_Cut.png" height="300" width = "400">

##Step 13 Personal safety
* The machine can throw off bits of material, so please wear safety glasses.
* These machines can be quite loud, so please wear ear protection.
* The sawdust can be very dangerous if inhaled, so please wear a dust mask or a respirator.

##Step 14 Do the cut
Turn on the spindle. Click the blue triangle (which points right) in the tool bar to begin cutting.

When cutting is finished, use the + control to move the head up and out of the way and remove the workpiece from the table.

Here's a couple of pictures of the final cut.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/FinalCut1.jpg" height="300" width = "400">
<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/FinalCut2.jpg" height="300" width = "400">
