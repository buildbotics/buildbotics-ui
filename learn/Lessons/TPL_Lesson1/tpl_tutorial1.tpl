units(METRIC);
feed(400);
tool(1);
speed(2000);
rapid({z: 5});
rapid({x: 1, y: 1});
cut({z: -3});
cut({x: 11});
cut({y: 11});
cut({x: 1});
cut({y: 1});
rapid({z: 5});
speed(0);
print('M2\n');
