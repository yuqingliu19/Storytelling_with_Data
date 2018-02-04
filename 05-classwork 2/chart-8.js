(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#chart-8")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create any scales you might need
  var xPositionScale = d3.scaleLinear().domain([1,25]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0,50]).range([height, 0]);
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // How do we deal with missing/undefined data?
  // (thinking of it as 'undefined' is better than as 'missing'
  // for memory's sake)
  var line = d3.area()
    .x(function(d) { return xPositionScale(d.day); })
    .y1(function(d) { return yPositionScale(d.temperature); })
    .y0(height)
    .curve(d3.curveBasis);

  // Open up the file to look for missing data
  d3.queue()
    .defer(d3.csv, "data-multiline-missing-data.csv")
    .await(ready);

  function ready(error, datapoints) {

    // Cut and paste from chart 7 to draw your areas


    // Add in the axes
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