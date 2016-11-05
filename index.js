require('babel-polyfill')
require('./lib/aframe.min.js');

require('aframe-animation-component');
//require('aframe-extrude-and-lathe');
require('./components/calendar-heatmap');
require('./components/topo');


var eAndL = require('aframe-extrude-and-lathe');
AFRAME.registerComponent('extrude', eAndL.extrudeComponent);
AFRAME.registerComponent('lathe',   eAndL.latheComponent);
