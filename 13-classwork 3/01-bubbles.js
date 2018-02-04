(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // need a d3 forceSimulation
  // which uses some d3 forces
  // to figure out where everything goes

  d3.queue()
    .defer(d3.csv, "sales.csv")
    .await(ready)

  function ready (error, datapoints) {

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")

    // We'll use this later
    // simulation.nodes(datapoints)
    //   .on('tick', ticked)

  
    // We'll use this later
    // function ticked() {
    //   svg.selectAll("circle")
    //       .attr("cx", function(d) { return d.x; })
    //       .attr("cy", function(d) { return d.y; });
    // }

  }

})();