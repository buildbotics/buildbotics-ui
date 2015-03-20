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
