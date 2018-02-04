(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 500 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  /* Build your SVG */
  var svg = d3.select("#graphic-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* 
    A few scales:
    colorScale - for d.region (continent)
    radiusScale - for d.killed (# killed)
    barHeightScale - for d.killed
    barXPositionScale - for d.country (country name)
  */
  var colorScale = d3.scaleOrdinal()
    .range(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'])

  var radiusScale = d3.scaleSqrt()
    .range([3, 80])

  var barHeightScale = d3.scaleLinear()
    .range([1, height])

  var barXPositionScale = d3.scaleBand()
    .range([0, width])

  /* Build our simulation */
  var forceX = d3.forceX(width / 2)
  var forceY = d3.forceY(height / 2)
  var forceCollide = d3.forceCollide(function(d){
    return radiusScale(d.killed) + 1
  })

  var simulation = d3.forceSimulation()
      .force("x", forceX)
      .force("y", forceY)
      .force("collide", forceCollide)

  /* Get ready to make a map */
  var projection = d3.geoMercator()
    .translate([ width / 2, height / 2 ])
    .scale(110)

  var path = d3.geoPath()
    .projection(projection)

  d3.queue()
    .defer(d3.csv, "terrorism-coords.csv")
    .defer(d3.json, "world.topojson")
    .await(ready)

  function ready(error, datapoints, countryData) {
    // Update our radius and bar scales to know the max killed
    var maxKilled = d3.max(datapoints, function(d) {
      return +d.killed
    })

    radiusScale.domain([0, maxKilled])
    barHeightScale.domain([0, maxKilled])

    /* Update our bar X position scale (and put in order) */
    datapoints.sort(function(a, b) {
      return a.killed - b.killed
    })
    var countryNames = datapoints.map(function(d) { return d.country })
    barXPositionScale.domain(countryNames)

    /* Draw our map */
    var countries = topojson.feature(countryData, countryData.objects.countries).features;

    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", "#e3e3e3")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0)

    /* Now listen for events */

    /* When we get to #terror-europe, draw Europe */
    d3.select("#terror-europe").on('stepin', function() {
      // Show JUST europe

      var europe = datapoints.filter(function(d) {
        return d.region === 'Europe & Russia'
      })

      // what do we do with that???
      svg.selectAll("circle")
        .data(europe, function(d) {
          return d.country
        })
        .enter().append("circle")
        .attr("r", function(d) {
          return radiusScale(d.killed)
        })
        .attr("fill", function(d) {
          return colorScale(d.region)
        })

      simulation.nodes(europe, function(d) {
          return d.country
        })
        .on('tick', ticked)
    })

    /* When we get to #terror-all, draw everything */
    // What goes here??

    d3.select("#terror-all").on('stepin', function() {
      svg.selectAll("rect").remove()
      svg.selectAll(".country").attr("opacity", 0)

      // Let's redo all of this but with
      // all of the datapoints
      svg.selectAll("circle")
        .data(datapoints, function(d) {
          return d.country
        })
        .enter().append("circle")
        .attr("r", function(d) {
          return radiusScale(d.killed)
        })
        .attr("fill", function(d) {
          return colorScale(d.region)
        })

      simulation.nodes(datapoints, function(d) {
          return d.country
        })
        .on('tick', ticked)
        .alpha(1)
        .restart()
      })


    /* When we get to #terror-map, draw a map */
    d3.select("#terror-map").on('stepin', function() {
      // Bring the map layer back
      svg.selectAll(".country")
        .transition()
        .attr("opacity", 1)
      
      // Turn off the simulation
      simulation.stop()

      // Now move our circles to where they belong
      // Taking our longitude and latitude columns
      // converting them into pixel coordinates 
      // on our screen
      // and returning the first one (the x)
      // or the second one (the y)

      svg.selectAll("circle")
        .attr("opacity", 1)
        .transition()
        .duration(1500)
        .attr("cx", function(d) {
          var coords = projection([d.lng, d.lat])
          return coords[0]
        })
        .attr("cy", function(d) {
          var coords = projection([d.lng, d.lat])
          return coords[1]
        })
        .attr("opacity", 0.5)
    })

    /* When we get to #terror-bar, draw a bar graph */
    d3.select("#terror-bar").on('stepin', function() {
      svg.selectAll("circle")
        .transition()
        .duration(1500)
        .attr("cy", height)
        .attr("cx", function(d) {
          return barXPositionScale(d.country) + barXPositionScale.bandwidth() / 2
        })
        .transition()
        .attr("r", 0)
        .remove()

      svg.selectAll("rect")
        .data(datapoints)
        .enter().append("rect")
        .attr("width", barXPositionScale.bandwidth())
        .attr("fill", function(d) {
          return colorScale(d.region)
        })
        .attr("x", function(d) {
          return barXPositionScale(d.country)
        })
        .attr("y", height)
        .attr("height", 1)
        .transition()
        .delay(1500)
        .duration(1500)
        .attr("y", function(d) {
          return height - barHeightScale(d.killed)
        })
        .attr("height", function(d) {
          return barHeightScale(d.killed)
        })
    })

    function ticked() {
       svg.selectAll("circle")
        .attr("cx", function(d){
          return d.x
        })
        .attr("cy", function(d){
          return d.y
        })
    }

  }

})()