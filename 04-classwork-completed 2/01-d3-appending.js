(function () {

  var datapoints = [ 45, 10, 100, 22, 9 ]
  var width = 800
  var height = 200

  // select (or build!) the SVG
  // grab the thing with the id of chart
  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

  // build your scales
  var widthScale = d3.scaleLinear()
    .domain([0, 100]) // inputs between 0-100
    .range([0, width]) // outputs between 0-800

  var yPositionScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4])
    .range([0, height])
    .paddingInner(0.5) // 50% of the bar

  // select the rectangles,
  // and bind the data
  // and set the width
  svg.selectAll("rect")
    .data(datapoints) // bind to data
    .enter().append("rect")
    .attr("width", function(d) {
      return widthScale(d)
    })
    .attr("height", yPositionScale.bandwidth())
    .attr("x", 0)
    .attr("y", function(d, i) {
      return yPositionScale(i)
    })


})()


