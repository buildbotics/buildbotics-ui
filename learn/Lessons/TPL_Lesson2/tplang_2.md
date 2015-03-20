#A taste of TPL's Javascript Roots

##Introduction
In my first tutorial [Introduction to the Tool Path Language (TPL)](https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/TPL_Lesson1/tplang_1.md), I gave a very brief introduction and showed how to cut a very simple shape.  In the end we noticed that very little was gained by using TPL over [g-code](http://reprap.org/wiki/G-code).

In this tutorial, you will begin to see how TPL's Javascript roots change everything.

As a side note, I've known many people that draw the line at "writing code" and simply refuse to do it.  Even if you are one of those people, I ask that you read along.  Javascript and TPL programs are extremely easy to write, and you may find that you actually like it.

##Step 1 - Start your editor and create a tpl file

If you accept this challenge, open up a text editor and create a new file called tpl_tut2.tpl.  Save the file in a folder that is convenient for training. Configure the editor for Javascript language if it has that capability. 

##Step 2 - Set up for cutting and move to the starting point

We'll use the same setup statements that we used in my Intro tutorial, so enter the following lines in your editor and save the result.

```
  print(";This is a demonstration of TPL/Javascript");
  units(METRIC);
  feed(400);
  tool(1);
  speed(2000);
  rapid({z:3});
  rapid({x:0,y:0});
  cut({z:-3})
  
  
  rapid({z:3});
  speed(0);
  print('M2\n');
```

Notice that I added a "print" statement at the beginning.  The print statement allows things to be printed to the standard output, which is the g-code file.  In g-code, text following a semi-colon is a comment.  Therefore, print statements with strings starting with semi-colons allow you to put comments into your g-code file.  You could also use print statements to write g-code statements directly.

After the print statement, we establish that metric units will be used (specifically millimeters), the cutting speed will be 400 mm per minute, we will use tool number 1, and the spindle will turn at 2000 rpm.  Then we raise the cutting head to 3 millimeters, move to x=0,y=0 and cut down to 3 mm below the surface.  A gap is then provided and this is where we will put the meat of our program.

##Step 3 - Create a wave

Now insert the following statements in the gap following the "cut({z:-3})" statement.

```
  for(var i = 0; i <= 2 * Math.PI; i = i + Math.PI/60) {
    cut({x:10*i,y:5*Math.sin(i)});
  }
```
In Javascript, as well and most other programming languages, we use loops to do the same thing over and over again.  The code that we just entered is a "for loop".  The way to read it is as follows:
* set the variable i to 0
* then each time you complete the loop add pi/60 to i
* keep looping until i is no longer less than or equal to 2 times pi.

Note, the value of pi is approximately 3.14.  During the first loop, "i" will be zero and in the second, "i" will equal pi/60, and in the third "i" will equal 2 * pi/60, and so on until "i" equals 2 * pi at which point the "for loop" will be completed and the program will move on to the next statement.

Within the loop, you'll recognize the cut statement, but the part inside might be a little confusing.  This cut statement will cause the CNC machine to cut to the coordinates specified by "x:" and "y:" during each iteration.  Since the value of the variable "i" changes with each iteration and both the "x:" and "y:" coordinates use "i", their values will be different for each iteration.  This will cause the CNC head to cut to the new coordinate.

Finally, the "y:" coordinate includes at math function known as the "sine".  I won't attempt to explain sine waves, but will say that it will cause the "y:" coordinate to move up and down in a very nice wave as "i" changes.

Save your work at this time, and then execute the following statement at the command prompt:

```
  $ tplang tpl_tut2.tpl > tut2.ngc
```

This will execute your program and direct the resulting g-code to a file called tut2.ngc.  Then run the  [Camotics](http://www.openscam.org) simulator.  Open tut2.ngc from witin Camotics and you'll get an image that looks like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/TPL_Lesson2/tut2_1.png" height="320" width = "480">

#Step 4 - Create the opposite of the wave

Next, we'll create a sort of "lazy 8" by copying the code that we created before and modifying it to run the loop backwards, with the "y:" coordinate value equal to -1 times the values we used in the first loop.  The code in the gap should now look like this:

```
  for(var i = 0; i <= 2 * Math.PI; i = i + Math.PI/60) {
    cut({x:10*i,y:5*Math.sin(i)});
  }
  for(i = 2 * Math.PI; i >= 0; i = i - Math.PI/60) {
    cut({x:10*i,y:-5*Math.sin(i)});
  }
```
Note that the second loop starts at i = 2 * pi and works it's way back to i = 0.  This allows the second loop to start where the first loop stopped and therefore we don't have to raise the cutting head to move to the next cut.  The other difference is that the sine wave value in the "y:" coordinate is multiplied by -5 rather than 5 causing the wave to be opposite in the second loop.

Once again run the program by executing the following command at the command line:

```
  $ tplang tpl_tut2.tpl > tut2.ngc
```
Then simulate it in Camotics and you will get an image that looks like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/TPL_Lesson2/tut2_2.png" height="320" width = "480">

##Step 4 - Add an outer loop
Next, we put the whole thing inside another loop and run the same thing 12 times.  Each iteration of the loop will rotate the coordinate system around the z axis by pi/6 using TPL's rotate command.  Your entire program should now look like this:

```
  print(";This is a demonstration of TPL/Javascript");
  units(METRIC);
  feed(400);
  tool(1);
  speed(2000);
  rapid({z:3});
  rapid({x:0,y:0});
  cut({z:-3});
  for(k = 0;k < 12; k = k + 1){
    rotate(Math.PI/6,0,0,1);
    for(var i = 0; i <= 2 * Math.PI; i = i + Math.PI/60) {
      cut({x:10*i,y:5*Math.sin(i)});
    }
    for(i = 2 * Math.PI; i >= 0; i = i - Math.PI/60) {
      cut({x:10*i,y:-5*Math.sin(i)});
    }
  }
  rapid({z:3});
  speed(0);
  print('M2\n');
```
Once again, save the program, run tplang at the command line and simulate it in Camotics and you should get an image that looks like this:

<img src = "https://github.com/DougCoffland/buildbotics-ui/blob/master/learn/Lessons/TPL_Lesson2/tut2_3.png" height="320" width = "480">

##Summary
If you look at the g-code file (tut2.ngc) in your editor, you'll notice that it's pretty big (2288 lines of code).  This should give you a taste of the power of tplang because with a simple program totalling 20 lines of code, we were able to generate a fairly complex cut that includes 2888 lines of g-code.  In the next few lessons, I'll show you how to use some Javascript libraries that simplify creation of complex shapes even more.

On a final note, Buildbotics LLC is committed to the exchange of information for the betterment of small-scale manufacturing.  Your comments on this lesson are welcome.  Please send me an e-mail message at dougcoffland@gmail.com if you would like to submit a lesson or tutorial of your own.
