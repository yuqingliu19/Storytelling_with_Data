(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#chart-6")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create any scales you might need
  var xPositionScale = d3.scaleLinear().domain([1,25]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0,50]).range([height, 0]);
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Make the line curve based
  // https://github.com/d3/d3-shape#curves
  // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
  var line = d3.line()
    .x(function(d) { return xPositionScale(d.day); })
    .y(function(d) { return yPositionScale(d.temperature); })

  d3.queue()
    .defer(d3.csv, "data-multiline.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Group the data by the country

    // Draw the lines

    // Draw the dots

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

  }

})();