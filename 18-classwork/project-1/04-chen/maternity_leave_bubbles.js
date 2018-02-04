(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  var svg = d3.select("#chart3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var colorScale = d3.scaleLinear()
    .domain([0,52])
    .range(['white', 'red'])

  var categoryScale = d3.scalePoint()
    .range([-width, width * 2])

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
    .defer(d3.csv, "maternity_group_bubbles.csv")
    .await(ready)

  function ready (error, datapoints) {

    var categories = d3.map(function(d) { 
        return d.maternity_group
    }).keys()


    categoryScale.domain(categories)


    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width/2))
        .force("y", d3.forceY(height/2))
        .force("collide", d3.forceCollide(5)) //A froce from the middle the avoid overlap
   

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    var circles = svg.selectAll("circles")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', 3)
      .attr('fill', function(d){
        return colorScale(d.maternity_paid)
      })
      .attr('stroke', 'lightgray')
      .attr('cx', function(d) {
        return categoryScale(d.maternity_group)
      })
      .attr('cy', height/2)

      datapoints.forEach(function(d) {
        d.x = d.maternity_group
        d.y = 0
      })

      simulation.nodes(datapoints)
        .on('tick', ticked)

      function ticked() {
        circles
          .attr("cx", function(d){
            return d.x
          })
          .attr("cy", function(d){
            return d.y
          })
      }

  }

})();