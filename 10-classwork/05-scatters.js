(function() {
  var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-5")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var parseTime = d3.timeParse("%b")

  d3.queue()
    .defer(d3.csv, "03-high-low-by-month.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Build a container and move it to the middle
    // because we can't set the cx/cy on the radial
    // charts even though they're circular
    var container = svg.append("g")
      .attr("transform", "translate(200,200)")      

  }
})();