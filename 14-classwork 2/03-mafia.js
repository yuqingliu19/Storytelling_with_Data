(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  /*
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

  // Pulls connected nodes together with strength of... 0
  var forceLink = d3.forceLink()
    .id(function(d) { return d.id })
    .strength(0)

  // Nodes push apart with a strength of -20
  var manyBody = d3.forceManyBody()
    .strength(-20)

  /*
    We need a scale for manual positioning
  */


  d3.queue()
    .defer(d3.json, "mafia.json")
    .await(ready)

  function ready (error, graph) {
    // 'datapoints' has been renamed to 'graph'
    // all our links are graph.links
    // all of our nodes are graph.nodes

    // These are the people we want to put around the outside
    var people = graph.nodes.filter(function(d) {
      return d.node_group === 1;
    })

    /*
      If you have defs and want images...
      <pattern height="100%" width="100%" patternContentUnits="objectBoundingBox">
        <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="snow.png"></image>
      </pattern>
    */

    var draggable = d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended)

    // Should we adjust the stroke width?
    // 
    var links = svg.selectAll(".connection")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke", "#ccc")
        .attr("class", "connection")
        .attr("fill", "none")
        .attr("stroke-width", 1)

    var nodes = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .attr("fill", function(d) {
        if(d.node_group == 2) {
          // you are a class, not a person
          return "lightblue"
        } else {
          return "pink"
        }
      })
      .call(draggable)

    // Nodes will be positioned with this, but don't uncomment it yet!
    // nodes.each(function(d) {
    //     if(d.node_group == 1) {
    //       var angle = angleScale(d.id)
    //       d.fx = 200 * Math.cos(angle)
    //       d.fy = 200 * Math.sin(angle)
    //     }
    //    })


    // Let's tell the simulation about the nodes
    // and tell it to run ticked on every tick event


    // lets go grab the force we called 'links'
    // and tell it about the links between nodes


    function ticked() {
      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    // fx means "don't move from this x"
    // fy means "don't move from this y"
    // so if we want to give all of our circles
    // a SPECIFIC, DO-NOT-MOVE-FROM-HERE x and y
    // we should set fx and fy on them
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
    }

  }

})();