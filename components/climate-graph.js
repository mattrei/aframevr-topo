var d3 = require('d3');
require('d3-scale')
var randomColor = require('randomcolor')

const MAX_HEIGHT = 5

// TODO make global or scale depending on 
var hscale = d3.scaleLinear()
      .domain([-50, 50])
      .range([-MAX_HEIGHT, MAX_HEIGHT])

var rscale = d3.scaleLinear()
      .domain([0, 300])
      .range([0, MAX_HEIGHT])

var mscale = d3.scaleLinear()
      .domain([0, 11])
      .range([-3, 3])


AFRAME.registerComponent('climate-graph', {
  schema: {
    json: {default: ''},
    scaleY: {default: 0.02},
    size: {default: 0.05},
    monthMargin: {default: 0.2}
  },

  init: function () {
    d3.json('data/aut_tas.json', this.temperature.bind(this));
    d3.json('data/aut_pr.json', this.rainfall.bind(this));

    this.axis()
  },

  axis: function()  {

    var axis = d3.select(this.el)
      .selectAll('.xaxis')
      .data([-10, -5, 0, 5, 10, 15])
      .enter()
      .append('a-entity')
      .attr('meshline', (datum) => {

        const path = [
          `${mscale(0)} ${hscale(datum)} 0`,
          `${mscale(11)} ${hscale(datum)} 0`,
          ]
        return {
          lineWidth: 5,
          path: path.join(',')
        }
      })

  },

  rainfall: function (err, json) {
    var data = this.data;
    var el = this.el;


    d3.select(this.el)
      .selectAll('.monthrain')
      .data(json)
      .enter()
      .append('a-entity')
      .attr('data-month', (datum) => datum.month)
      .attr('data-value', (datum) => datum.data)
      .attr('geometry', (datum) => {
        return {
          primitive: 'circle',
          radius: 0.05
        }
      })
      .attr('position', (datum, i) => {
        return {
          x: mscale(datum.month),
          y: rscale(datum.data),
          z: 0
        }
      })
      .attr('material', {
        color: 'blue'
      });

    d3.select(this.el)
      //.select('curve')
      .append('a-entity')
      .datum(json)
      .attr('meshline', (datum) => {
        console.log("MESH")
        const path = datum.map(d => {
          return `${mscale(d.month)} ${rscale(d.data)} 0`
        })
        console.log(path)
        return {
          lineWidth: 5,
          path: path.join(','),
          color: randomColor()
        }
      })

  },

  temperature: function (err, json) {
    var data = this.data;
    var el = this.el;

    var month = d3.select(el)
      .selectAll('.month')
      .data(json)
      .enter()
      .append('a-entity')
      .attr('data-month', (datum) => datum.month)
      .attr('data-value', (datum) => datum.data)
      .attr('geometry', (datum) => {
        return {
          primitive: 'box',
          depth: data.size,
          height: hscale(datum.data),
          width: data.size
        }
      })
      .attr('position', (datum, i) => {
        return {
          x: mscale(datum.month),
          // cubes are positioned by their center
          y: hscale(datum.data)/2,
          z: 0
        }
      })
      .attr('material', {
        color: 'brown'
      });

    el.emit('climate-graph-generated');
  }
});
