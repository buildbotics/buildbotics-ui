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
