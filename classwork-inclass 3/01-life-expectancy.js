(function() {
  var margin = { top: 20, left: 100, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // Build your SVG
  var svg = d3.select("#graphic-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* 
    Create a few scales 
    xPositionScale - gdp_per_capita
    yPositionScale - life expectancy
    barYPositionScale - continent
    barWidthScale - average life expectancy
  */ 
  var xPositionScale = d3.scaleLinear()
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .range([height, 0])

  var barYPositionScale = d3.scaleBand()
    .range([height, 0])

  var barWidthScale = d3.scaleLinear()
    .domain([0, 80])
    .range([0, width])

  d3.queue()
    .defer(d3.csv, "countries.csv", function(d) {
      // Convert to numbers in case we forget later
      d.gdp_per_capita = +d.gdp_per_capita
      d.life_expectancy = +d.life_expectancy
      return d
    })
    .await(ready)

  function ready(error, datapoints) {
    /* 
      Set the maximums for the scales (gdp + life expectancy) 
    */
    var gdpMax = d3.max(datapoints, function(d) { return d.gdp_per_capita })
    xPositionScale.domain([0, gdpMax])

    var lifeMax = d3.max(datapoints, function(d) { return d.life_expectancy })
    yPositionScale.domain([0, lifeMax])
    
    /*
      Draw some circles
    */


    /*
      Draw some axes
    */

    var xAxis = d3.axisBottom(xPositionScale)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    /*
      Let's listen for events
    */

    d3.select("#all-countries").on('stepin', function() {
      svg.selectAll("circle")
        .data(datapoints, function(d) {
          // give our data point a unique name
          return d.country
        })
        .enter().append("circle")
        .attr("opacity", 0.5)
        .on('mouseover', function(d) {
          console.log("Hovering over", d.country)
        })
        .attr("cx", function(d) {
          return xPositionScale(d.gdp_per_capita)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.life_expectancy)
        })
        .attr("r", 0)
        .attr("fill", "grey")
        .transition()
        .duration(1000)
        .attr("r", 5)
    })

    d3.select("#europe-highlight").on('stepin', function() {
      svg.selectAll("circle")
        .filter(function(d) {
          return d.continent === 'Europe'
        })
        .raise()
        .attr("opacity", 1)
        .attr("fill", "pink")
    })

    d3.select("#europe-show").on('stepin', function(d) {
      // Filter datapoints for just europe
      var europe = datapoints.filter(function(d) {
        return d.continent == "Europe"
      })

      console.log("European countries are", europe)

      var circles = svg.selectAll("circle")
        .data(europe, function(d) {
          // give our data point a unique name
          return d.country
        })

      // Any circles without data? Remove them!
      circles.exit().remove()

      // Any remaining circles? Let's change them!
      circles.enter().append("circle")
        .attr("opacity", 0.5)
        .attr("cx", function(d) {
          return xPositionScale(d.gdp_per_capita)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.life_expectancy)
        })
        .attr("r", 0)
        .attr("fill", "grey")
        .transition()
        .duration(1000)
        .attr("r", 5)
    })

    d3.select("#africa-show").on('stepin', function(d) {
      // Filter datapoints for just europe
      var africa = datapoints.filter(function(d) {
        return d.continent == "Africa"
      })

      // STEP 1: Rebind our data and save the
      // new stuff as a variable
      var circles = svg.selectAll("circle")
        .data(africa, function(d) {
          return d.country
        })

      // STEP 2: Remove any circles without data
      circles.exit().remove()

      // STEP 3: Add circles for any datapoints
      // that don't have data
      circles.enter().append("circle")
        .attr("opacity", 0.5)
        .attr("cx", function(d) {
          return xPositionScale(d.gdp_per_capita)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.life_expectancy)
        })
        .attr("r", 0)
        .attr("fill", "grey")
        .transition()
        .duration(1000)
        .attr("r", 5)

    })


    d3.select("#everything").on('stepin', function(d) {
      /* Show everything */

      // Rebind to ALL our data points
      var circles = svg.selectAll("circle")
        .data(datapoints, function(d) {
          return d.country
        })

      // remove any circle without a data point
      circles.exit().remove()

      // add a circle for any data point missing one
      // then let's update the styles for
      // BOTH the new stuff
      // AND the existing stuff
      // (that's .merge)
      circles.enter().append("circle")
        .attr("r", 0)
        .merge(circles)
        .attr("opacity", 0.5)
        .attr("cx", function(d) {
          return xPositionScale(d.gdp_per_capita)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.life_expectancy)
        })
        .attr("fill", "green")
        .transition()
        .duration(1000)
        .attr("r", 5)


    })

    d3.select("#bar-average").on('stepin', function(d) {
      /* 
        Show bars now!
        Average per continent, calculate with d3.nest().rollup
       */

      var averages = d3.nest()
        .key(function(d) {
          return d.continent
        })
        .rollup(function(values) {
          return d3.mean(values, function(d) { 
            return d.life_expectancy 
          })
        })
        .entries(datapoints)

      console.log('averages are', averages)

      var continentNames = averages.map(function(d) {
        return d.key
      })
      
      barYPositionScale.domain(continentNames).padding(0.5)

      svg.selectAll("rect")
        .data(averages)
        .enter().append("rect")
        .attr("height", barYPositionScale.bandwidth())
        .attr("x", 0)
        .attr("y", function(d) {
          return barYPositionScale(d.key)
        })
        .transition()
        .delay(1500)
        .duration(1500)
        .attr("width", function(d) {
          return barWidthScale(d.value)
        })

      svg.selectAll("circle")
        .transition()
        .duration(1500)
        .attr("cx", 0)
        .attr("cy", function(d) {
          return barYPositionScale(d.continent) + barYPositionScale.bandwidth() / 2
        })
        .transition()
        .attr("r", 0)
        .remove()

      /* Update our scales */    

      xAxis.scale(barWidthScale)
      svg.select(".x-axis").transition().call(xAxis)

      yAxis.scale(barYPositionScale)
      svg.select(".y-axis").transition().call(yAxis)
    })

    d3.select("#bar-average").on('stepout', function(d) {
      /* What do we do when we leave the bar area? */
      svg.selectAll("rect").remove()

    })
  }

})();









