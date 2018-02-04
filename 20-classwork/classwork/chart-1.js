(function() {

  var height = 300,
      width = 400
  
  var svg = d3.select("#graphic-1")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

  var datapoints = [100, 23, 33, 42]

  var widthScale = d3.scaleLinear().domain([0, d3.max(datapoints)]).range([0, width])
  var yPositionScale = d3.scaleBand().domain([0, 1, 2, 3]).range([0, height]).padding(0.5)

  // Step 0: Setup
  svg.selectAll("rect")
    .data(datapoints)
    .enter().append("rect")
    .attr("height", yPositionScale.bandwidth())
    .attr("width", 10)
    .attr("y", function(d, i) {
      return yPositionScale(i)
    })
    .attr("fill", "black")

  // Step 1: Set them to the right width
  d3.select("#first-step").on('stepin', function() {
    svg.selectAll("rect")
      .transition()
      .attr("width", function(d) {
        return widthScale(d)
      })
  })

  // Step 2: Make them pink
  d3.select("#second-step").on('stepin', function() {
    svg.selectAll("rect")
      .transition()
      .attr("fill", "pink")
  })

  // Step 3: Sort them
  d3.select("#third-step").on('stepin', function() {
    var sorted = datapoints.sort(function(a, b) {
      return b - a
    })
    svg.selectAll("rect")
      .data(sorted)
      .transition()
      .attr("y", function(d, i) {
        return yPositionScale(i)
      })
      .attr("width", function(d) {
        return widthScale(d)
      })
  })
})()