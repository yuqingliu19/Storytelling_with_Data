(function() {
  var margin = { top: 30, left: 30, right: 100, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create our scales
  var xPositionScale = d3.scaleLinear().domain([1,12]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([20,100]).range([height, 0]);

  // Create a line generator
  // This explains how to compute
  // the points that make up the line
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.month)
    })
    .y(function(d) {
      return yPositionScale(d.high)
    })

  // Read in files
  d3.queue()
    .defer(d3.csv, "all-temps.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Draw the circles
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.month)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.high)
      })


    // Draw the lines

    var nested = d3.nest()
      .key(function(d) {
        return d.city
      })
      .entries(datapoints)

    console.log(nested)

    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", function(d) {
        return line(d.values)
      })

    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .text(function(d) {
        // Give me the name of the group!!!
        return d.key
      })
      .attr("x", width)
      .attr("y", function(d) {
        // Okay so we have the grouped data
        // go through all of the datapoints
        // find the datapoint where month is a 12
        var last = d.values.find(function(d) {
          return +d.month === 12
        })

        // if they're ordered, I could do this
        var last = d.values[d.values.length - 1]

        // and then we'll use its high temperature
        // and the y position scale
        return yPositionScale(last.high)
      })
      .attr("dx", 5) // push 5 pixels right
      .attr("dy", 3) // push 3 pixels down
      .attr("font-size", "9px")

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale)
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

  }

})();