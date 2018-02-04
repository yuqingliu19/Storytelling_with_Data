(function() {
  var margin = {top: 30, left: 50, right: 450, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create a time parser
  var parseTime = d3.timeParse("%B-%y")

  // Create your scales
  var xPositionScale = d3.scaleTime().range([0, width])
  var yPositionScale = d3.scaleLinear().range([height, 0]).domain([189, 350])
  var colorScale = d3.scaleOrdinal().range(['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#FF8200','#537F26','#FF6CD3','#8E90FF'])

  d3.queue()
    .defer(d3.csv, "housing-prices.csv", function(d) {
      d.datetime = parseTime(d.month);
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {

    xPositionScale.domain(d3.extent(datapoints, function(d){
        return d.datetime; 
        })
      )

    // Draw your dots
    var nested = d3.nest()
      .key(function(d) {
        return d.region
      })
      .entries(datapoints)

    var decDatetime = parseTime("December-16"), 
        febDatetime = parseTime("February-17")

    svg.append("rect")
      .attr("fill", "lightgray")
      .attr("x", xPositionScale(decDatetime))
      .attr("y", 0)
      .attr("width",  xPositionScale(febDatetime) - xPositionScale(decDatetime))
      .attr("height", height)

    var line = d3.line()
        .x(function(d){
          return xPositionScale(d.datetime)
        })
        .y(function(d){
          return yPositionScale(d.price)
        })

    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d) {
        return line(d.values)
      })
      .attr("stroke", function(d) {
        return colorScale(d.key)
      })
      .attr("stroke-width", 2)
      .attr("fill", "none")

    svg.selectAll("circle")
      .data(nested)
      .enter().append("circle")
      .attr("fill", function(d) {
        return colorScale(d.key)
      })
      .attr("r", 3)
      .attr("cx", xPositionScale(nested[0].values[0].datetime))
      .attr("cy", function(d) {
        return yPositionScale(+d.values[0].price)
      })

    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .text(function(d) {
        return d.key
      })
      .attr("x", xPositionScale(nested[0].values[0].datetime))
      .attr("y", function(d) {
        return yPositionScale(+d.values[0].price)
      })
      .attr("dx", 3)

     svg.append("text")
      .text("U.S. housing prices fall in winter")
      .attr("x", width / 2)
      .attr("y", -margin.top/2)
      .attr("text-anchor", "middle")
      .attr("font-size", "20")

    // Add your axes
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%b %y")).ticks(5)

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