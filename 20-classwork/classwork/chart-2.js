(function() {

  var height = 300,
      width = 300
  
  var svg = d3.select("#graphic-2")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

  var datapoints = [100, 23, 33, 42]

  var widthScale = d3.scaleLinear().domain([0, d3.max(datapoints)]).range([0, width])
  var yPositionScale = d3.scaleBand().domain([0, 1, 2, 3]).range([0, height]).padding(0.5)

  svg.selectAll("rect")
    .data(datapoints)
    .enter().append("rect")
    .attr("height", yPositionScale.bandwidth())
    .attr("width", 5)
    .attr("y", function(d, i) {
      return yPositionScale(i)
    })
    .attr("fill", "black")

  d3.select("#step-2-1").on('stepin', function() {
    svg.selectAll("rect")
      .transition()
      .duration(750)
      .attr("width", function(d) {
        return widthScale(d)
      })
  })

  d3.select("#step-2-2").on('stepin', function() {
    svg.selectAll("rect")
      .transition()
      .duration(750)
      .attr("fill", "pink")
  })
})()