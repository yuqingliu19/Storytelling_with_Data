/*********
*
* D3 example #01:
* Introduction to SVG
* Selecting elements
* Manipulating attributes
* Maybe even scales!
*
*********/

(function () {

   var datapoints = [ 45, 10, 100, 22 ]

  // d3 code goes here
  var svg = d3.select('svg')

  //From inside the svg element, grab everything with the tag name 'circle'

  svg.selectAll('circle')
    .attr('fill','pink')
    .attr('r', 40)

  var widthScale = d3.scaleLinear()
    .domain([0,100])
    .range([0,650])

  svg.selectAll('rect')
    .data(datapoints)
    .attr('fill','lightblue')
    .attr('width',function(d){
      console.log(d)
      return widthScale(d)
    })

})()