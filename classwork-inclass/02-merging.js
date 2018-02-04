(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* d3.map() for storage */
  var stateStorage = d3.map()

  /* Pull in states and results */
  d3.queue()
    .await(ready)

  /* Create a projection for the USA */

  function ready (error, data) {

    /* Draw your states and color them */
  }

})();