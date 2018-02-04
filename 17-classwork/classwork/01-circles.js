(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .style('background')
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var radiusScale = d3.scaleSqrt().domain([0,10]).range([0,30])
  
  /* Pull in world and capitals */
  
  d3.queue()
    .defer(d3.csv, 'data/capitals.csv')
    .defer(d3.json, 'data/world.topojson')
    .await(ready)

  /* 
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */
  var projection = d3.geoMercator()
    .translate([width/2, height/2])
    console.log(projection([-48, 72]))


  /*
    create a path (geoPath)
    using the projection
  */

  var path = d3.geoPath
    .projection(projection)


  function ready (error, capitals, world) {
    console.log(capitals)

    console.log(world)

    var worldData = topojson.feature(world, world.objects.countries).features

    console.log(worldData)

    /* Draw your countries */
    svg.selectAll('.country')
      .data(worldData)
      .enter().append('path')
      .attr('class', 'country')
      .attr('d', function(d){
        return path(d)
      })
      .attr('fill','#cccccc')
      .attr('stroke', 'white')
      .attr('stroke-width', )

    svg.selectAll('.capital')
      .data(capitals)
      .enter().append('circle')
      .attr('class', 'capital')
      .attr('r', 5)
      .on('mouseover', function(d){
        console.log(d)
      })
      .attr('cx', function(d){
        var coords = projection([d.long, d.lat])
        return coords[0]
      })
      .attr('cy', function(d){
        var coords = projection([d.long, d.lat])
        return coords[1]
      })

    d3.select


    /* Draw your circles */

  }

})();