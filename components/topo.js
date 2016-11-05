//const world = require("./node_modules/world-atlas/world/110m.json")
var d3 = require('d3');
//require('d3-geo');
var d3GeoProjection = require('d3-geo-projection');
const randomColor = require('randomcolor')
var topojson = require('topojson-client')
var svgMesh3d = require('svg-mesh-3d')
const createGeom = require('three-simplicial-complex')(AFRAME.THREE)

var d3threeD = require('./d3-threeD')

AFRAME.registerComponent('topo', {
    schema: {
        colors: {
            type: 'array',
            default: ['#F7F6DE', '#EFD510', '#FA7E0A', '#8F0E0E', '#530C0C']
        },
        topojson: {
            default: "./node_modules/world-atlas/world/110m.json"
        },
        scaleY: {
            default: 0.02
        },
        size: {
            default: 0.03
        }
    },

    init: function() {
        d3.json(this.data.topojson, this.generate.bind(this));
    },

    generate: function(err, json) {
        const data = this.data;
        const el = this.el;


        const projection = d3GeoProjection.geoKavrayskiy7()//d3.geoMercator()
            .scale(1)
            .translate([0, 1]);

        const geoPath = d3.geoPath(projection)
            //.projection(projection)
            //.pointRadius(1.5);
            

        //const topo = topojson.mesh(json, json.objects.countries)
        const countries = topojson.feature(json, json.objects.countries).features
        console.log(countries)
        
        
        for (const country of countries) {
          const svgPath = geoPath(country)
                  d3.select(el)
                  .append('a-entity')
                  .attr('id', 'world')
                  .attr('position', '0 0 0')
                  .attr('geometry', {
                    primitive: 'myextrude',
                    svgPath: svgPath,
                  })
                  .attr('material', {
                    color: randomColor()
                  });
        }


        el.object3D.rotation.z = Math.PI
        el.object3D.rotation.y = Math.PI

        el.emit('topo-generated');
    }
});


AFRAME.registerGeometry('myextrude', {
  schema: {
    svgPath: {
      default: "M366.2182,108.9780 L368.0329,110.3682 L367.5922,112.4411 L369.9258,116.0311 L368.9827,117.3543 " +
    "L371.5686,119.8491 L370.5599,121.7206 L372.9314,124.8009 L368.8889,126.7603 L369.2695,130.7622 " +
    "L366.1499,130.3388 L363.4698,128.1161 L362.9256,125.6018 L360.8153,126.4025 L360.2968,124.3588 " +
    "L361.9519,121.1623 L360.4475,118.7162 L358.1163,117.8678 L358.7094,115.7577 L361.6243,112.4576 Z"
    },
    amount: {
      default: 20
    }
  },
  init: function (data) {

    var singleGeometry = new THREE.Geometry();

      const svgpath = d3threeD.transformSVGPath(data.svgPath)
            const shapes = svgpath.toShapes(true)
            for (const shape of shapes) {
                const geometry = shape.extrude({
                    amount: data.amount,
                    bevelEnabled: false
                });
                singleGeometry.merge(geometry)
            }
            
   
   this.geometry = singleGeometry 
  }
});
