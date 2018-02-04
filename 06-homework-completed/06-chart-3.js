(function() {
  var margin = { top: 30, left: 50, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 3");

  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create your scales
  var xPositionScale = d3.scaleLinear().range([0, width]).domain([2000, 2014])
  var yPositionScale = d3.scaleLinear().range([height, 0]).domain([0, 500])
  var colorScale = d3.scaleOrdinal().range(['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f'])

  // Create a d3.line function that uses your scales
  var area = d3.area()
    .x0(function(d) {
      return xPositionScale(d.Year)
    })
    .y0(function(d) {
      return yPositionScale(d.Value)
    })
    .x1(function(d) {
      return xPositionScale(d.Year)
    })
    .y1(function(d) {
      return height
    })

  d3.queue()
    .defer(d3.csv, "air-emissions.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Draw your dots



    var nested = d3.nest()
    .key(function(d) {
    	return d.Country
    })
    .entries(datapoints)

    svg.selectAll("path")
    	.data(nested)
    	.enter().append("path")
    	.attr("d", function(d) {
    		return area(d.values)
    	})
    	.attr("opacity", 0.5)
      .attr("stroke", 'black')
      .attr("stroke-width", 1)
      .attr("fill", function(d) {
      	return colorScale(d.key)
      })

    // Add your axes
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format("d"))

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