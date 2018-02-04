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


  var radiusScale = d3.scaleSqrt()
    .domain([3,26])
    .range([0,30])

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>State:</strong> <span>" + d.State + " ,<strong>Total Collisions:</strong> <span>"+ d.Number_of_drivers_involved_in_fatal_collisions_per_billion_miles+"</span>"
        //return "<strong>totalcollisions:</strong> <span>" + d.Number_of_drivers_involved_in_fatal_collisions_per_billion_miles + "</span>";
      })

    svg.call(tip)

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

  var simulation = d3.forceSimulation()
    .force("x",d3.forceX(width/2))
    .force("y",d3.forceY(height/2))
    .force("collide",d3.forceCollide(function(d){
      return radiusScale(d.Number_of_drivers_involved_in_fatal_collisions_per_billion_miles) + 1
    }))

  d3.queue()
    .defer(d3.csv, "bad-drivers-numbers.csv")
    .await(ready)

  function ready (error, datapoints) {

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("fill",function(d){
        if(d.Number_of_drivers_involved_in_fatal_collisions_per_billion_miles > 20){
          return "red"
        }
        else {return " grey"}
      })
      .attr('r', function(d) {
        return radiusScale(d.Number_of_drivers_involved_in_fatal_collisions_per_billion_miles)
      })
      .attr('cx',0)
      .attr('cy',0)
      .attr("opacity", 0.6)
      .on("mouseover", function(d) {
       // d3, go get the
       // element and make
       // the radius bigger

         var element = d3.select(this)
         // showing tip
         tip.show(d)
         // increasing the circle size
         if(element.attr("opacity") === '0.6') {
           element.transition().attr("opacity", 1)
         }

     })

     .on("mouseout", function(d) {


       var element = d3.select(this)
       // hiding the tip
       tip.hide(d)
       // reducing the size of the circle
       if(element.attr("opacity") === '1') {
         element.transition().attr("opacity", 0.6)
       }

     })

    // We'll use this later
    simulation.nodes(datapoints)
      .on('tick', ticked)

    d3.select("#speedingcollisions").on('click',function(){
      simulation.force("x",d3.forceX(function(d){
        if (d.Number_Of_Drivers_Involved_In_Fatal_Collisions_Who_Were_Speeding < 8){
          return width * 0.3
        } else {
          return width * 0.7
        }

      }))
      simulation.alphaTarget(0.3).restart()
    })

    d3.select("#alcoholimpairedcollisions").on('click',function(){
      simulation.force("x",d3.forceX(function(d){
        if (d.Number_Of_Drivers_Involved_In_Fatal_Collisions_Who_Were_Alcohol_Impaired < 7){
          return width * 0.3
        } else {
          return width * 0.7
        }

      }))
      simulation.alphaTarget(0.3).restart()
    })


    d3.select("#totalcollisions").on('click',function(){
      simulation.force("x",d3.forceX( width/2))
      simulation.alphaTarget(0.3).restart()
    })

    // We'll use this later
    function ticked() {
      svg.selectAll("circle")
          .attr("cx", function(d) {
            //console.log(d)
            return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

  }

})();
