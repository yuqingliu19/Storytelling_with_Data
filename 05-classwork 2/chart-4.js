(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#chart-4")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create any scales you might need
  var xPositionScale = d3.scaleLinear().domain([1,25]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0,50]).range([height, 0]);

  // Create line function

  // Read in data
  d3.queue()
    .defer(d3.csv, "data-singleline-cimmeria.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Create and style your elements


    // Calculate median temperature


    // Draw line at median temperature


    // Draw text at median temperature


    // Draw your axes

  }

})();