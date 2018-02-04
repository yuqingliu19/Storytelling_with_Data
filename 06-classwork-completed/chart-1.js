(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // We always just pretend the g is the svg
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // make your scales
  var xPositionScale = d3.scaleLinear()
    .domain([1, 25])
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .domain([10, 50])
    .range([height, 0])

  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.day)
    })
    .y(function(d) {
      return yPositionScale(d.temperature)
    })

  // Let's create some scales

  d3.queue()
    .defer(d3.csv, "data-singleline-cimmeria.csv")
    .await(ready)

  function ready(error, datapoints) {
    /* Add in your axes */

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    /*
      d is too complicated to calculate here
      so we made a d3.line() before,
      and we just feed it to attr("d")
    */
    svg.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black")

    /* Add in your temperature circles */

    svg.selectAll(".cimmeria-temp")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "cimmeria-temp")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.day)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.temperature)
      })

  }

})();









