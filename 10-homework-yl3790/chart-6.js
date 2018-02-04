(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 600 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

  var svg = d3.select("#chart-6")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.csv, "data/time-binned.csv")
    .await(ready)

  function ready(error, datapoints) {

  }
})();