(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // We always just pretend the g is the svg
  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Let's make some scales

  // Read in our data
  // Let's add in multiple files
  d3.queue()
    .defer(d3.csv, "data-singleline-cimmeria.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Draw everything

  }

})();