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

print('M2\n');
```

This program will generate the g-code for "Hello World!" in "Script Stroke-1" single line font.

For a detailed explanation of this code please refer to the lesson titled [How to cut text using the TPL HersheyText Aids Library](https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/HersheyText_Lesson1/TPL_HersheyText_Tut1.md).

##Step 2 - Convert TPL Program to g-code
This step converts the TPL program that we just entered to a g-code file named TextOnWood.ngc.

Move to your working directory and enter the following command.
```
$ tplang TextOnWood.tpl > TextOnWood.ngc
```
##Step 3 - Open Camotics simulator and load g-code
Open up the Camotics simulator and select "Open Project" from the File menu.  Browse to your working directory, select TextOnWood.ngc and click Open.  You will get an image of the cut text with the default tool that looks like this.

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Camotics_Simulation.png" height="300" width = "400">


##Step 4 - Configure tool 1 in Camotics
* Click the "Tool View" tab just above the display window
* Set the settings section to the followiing parameters:
   * Tool     1
   * Units    mm
   * Shape    Conical
   * Length   7.9375
   * Diameter 9.525

This creates a bit that will cut a 90 degree angle up to 5/16" deep. 

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Camotics_Tool_Setup.png" height="300" width = "400">

##Step 5 - Run the Camotic simulation
Click the "Simulation View" tab and then hit the F5 key to run the simulation.  The results should look like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Camotics_Simulation2.png" height="300" width = "400">

Save your work in a file called TextOnWood.xml.  This will be your project file and it includes the tool configuration we made as well as a reference to TextOnWood.ngc.  Use TextOnWood.xml to re-open this file if you want to make changes.  If you are satified with the appearance from the simulation move on to Step 6, otherwise go back to step 1 to adjust parameters and continue through step 5.  Rinse and repeat until it looks that way you want.

##Step 6 Open LinuxCNC and load TextOnWood.ngc
Open linuxCNC and select the configuration file for your router.

After LinuxCNC has opened, select "Open" from the file menu, browse to your working folder, select "TextOnWood.ngc, and open it.
<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Ready_To_Cut.png" height="300" width = "400">

##Step 7 Configure LinuxCNC Tool Table
Select "Edit tool table..." from the File menu. Select row number 1 and enter the following data on row 1.  Note, your data may differ depending on what tool you have available for this cut:
* Tool Column		1
* POC Column		1
* Z colum		0
* DIAM column		7.9
* Comment column	.375 x 5/16" conical bit
Then click "Write Tool Table File" and then click Dismiss

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Tutorials/CuttingTextWithFonts/Ready_To_Cut.png" height="80" width = "400">

## Step 8 Turn on the router controller
Turn on your router controller. Then, press F2 to power on the controller.

##Step 9 Install Tool 1
Select the Z radio button and then click and hold the + button until the cutting head is high enough to change the tool. Put the 3/8 x 5/16" conical tool (or whatever you have available) into the spindle.

##Step 10 Secure Workpiece to Router Table
I use clamps.  Double sided tape works as well.  If you use clamps, make sure the router will not hit them during the cut.  Make sure the workpiece is square with the table and it is in a position that allows sufficient room to cut out the text phrase. Note, the text will be about 12 inches long and approximately 1.7 inches high, and will work from the origin at x=0,y=0.  These dimensions be found by selecting Properties from the File menu in LunuxCNC.

##Step 11 Home Axes
Still using LinuxCNC, move the head to where you want the lower left point of the first letter to be.  Then select the X radio button and click Home Axis, and do the same with the Y radio button.   Select the Z radio buttion.  Using the jog speed control to adjust the speed of manual movements and using the + and - controls, move the cutting head to the a point where it just touches the surface of the workpiece.  Then click home axis.

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
