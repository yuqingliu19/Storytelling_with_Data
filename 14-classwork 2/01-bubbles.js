(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  /*
    Needs a d3 forceSimulation!
    used to figure out where everything goes

    The simulation needs to know about...
    1) pushing apart
    2) acknowledging links,
    3) not overlapping/colliding
    4) default positions on the x and y

    Node-link charts (can) require: 
      forceManyBody, forceCenter, forceCollide, 
      forceLink, forceX and forceY

    Create your simulation here
  */


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