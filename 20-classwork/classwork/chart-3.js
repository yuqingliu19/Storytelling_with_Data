(function() {

  var height = 300,
      width = 800
  
  var svg = d3.select("#graphic-3")
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
    .attr("width", 0)
    .attr("y", function(d, i) {
      return yPositionScale(i)
    })
    .attr("fill", "black")

    svg.selectAll("rect")
      .transition()
      .duration(750)
      .attr("width", function(d) {
        return widthScale(d)
      })
      .attr("fill", "pink")
})()