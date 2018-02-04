(function() {
  var margin = { top: 20, left: 100, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // We always just pretend the g is the svg
  var svg = d3.select("#graphic-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y-%m-%d"); 

  // make your scales
  var xPositionScale = d3.scaleTime()
    .range([0, width])
    .clamp(true)

  var yPositionScale = d3.scaleLinear()
    .domain([0, 10000])
    .range([height, 0])

  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.datetime)
    })
    .y(function(d) {
      return yPositionScale(d.price)
    })

  // Let's create some scales

  d3.queue()
    .defer(d3.csv, "btc-price.csv", function(d) {
      d.datetime = parseTime(d.date)
      return d
    })
    .await(ready)

  function ready(error, datapoints) {
    var dateRange = d3.extent(datapoints, function(d) {
      return d.datetime
    })
    
    xPositionScale.domain(dateRange)

    var xAxis = d3.axisBottom(xPositionScale)
      .tickFormat(d3.timeFormat("%Y-%m-%d"))
      .ticks(4)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
      .tickFormat(d3.format("$.0s"))

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    svg.append("path")
      .attr("id", "btc-price")
      .datum(datapoints)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black")

    var last = datapoints[datapoints.length - 1]

    svg.append("circle")
      .attr("id", "end-circle")
      .attr("opacity", 0.75)
      .attr("r", 5)
      .attr("fill", "black")
      .attr("cx", xPositionScale(last.datetime))
      .attr("cy", yPositionScale(last.price))

    d3.select("#gone-up").on('stepin', function() {
      svg.select("#end-circle")
        .transition()
        .attr("fill", "red")
        .attr("r", 10)
    })

    d3.select("#gone-up").on('stepout', function() {
      svg.select("#end-circle")
        .transition()
        .attr("fill", "black")
        .attr("r", 5)
    })

    d3.select("#china-off").on('stepin', function() {
      svg.append("circle")
        .attr("id", "china-circle")
        .attr("r", 0)
        .attr("opacity", 0.75)
        .attr("fill", "black")
        .attr("cx", xPositionScale(parseTime("2017-09-01")))
        .attr("cy", yPositionScale(4911.740016666667))
        .transition()
        .attr("fill", "red")
        .attr("r", 10)
    })

    d3.select("#china-off").on('stepout', function() {
      svg.select("#china-circle").remove()
    })

    d3.select("#current-time").on('stepin', function() {
      xPositionScale.domain([parseTime("2017-11-01"), parseTime("2017-11-27")])

      svg.select("#btc-price").transition().attr("d", line)
      svg.select(".x-axis").transition().call(xAxis)
    })

    d3.select("#current-time").on('stepout', function() {
      xPositionScale.domain(dateRange)

      svg.select("#btc-price").transition().attr("d", line)
      svg.select(".x-axis").transition().call(xAxis)
    })
  }

})();









