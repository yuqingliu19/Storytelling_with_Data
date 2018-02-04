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

    d3.select("#europe-highlight").on('stepin', function(d) {
      d3.selectAll("circle")
        .filter(function(d){
          return d.continent === 'europe'
        })
        .attr("fill", function(d) {
          if(d.continent == "Europe") {
            return 'blue'
          } else {
            return 'grey'
          }
        })
    })

    d3.select("#europe-show").on('stepin', function(d) {
      // Filter datapoints for just europe
      var europe = datapoints.filter(function(d) {
        return d.continent == "Europe"
      })
      console.log('European countries are', europe)

      svg.selectAll('circle')
        .data(europe)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', 'red')
    })

    d3.select("#africa-show").on('stepin', function(d) {
      // Filter datapoints for just europe
      var africa = datapoints.filter(function(d) {
        return d.continent == "Africa"
      })
    })


    d3.select("#everything").on('stepin', function(d) {
      /* Show everything */
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

      var continentNames = averages.map(function(d) {
        return d.key
      })
      
      barYPositionScale.domain(continentNames).padding(0.5)

        // .attr("height", barYPositionScale.bandwidth())
        // .attr("x", 0)
        // .attr("y", function(d) {
        //   return barYPositionScale(d.key)
        // })
        // .attr("width", function(d) {
        //   return barWidthScale(d.value)
        // })

      /* Update our scales */    

      // xAxis.scale(barWidthScale)
      // svg.select(".x-axis").transition().call(xAxis)

      // yAxis.scale(barYPositionScale)
      // svg.select(".y-axis").transition().call(yAxis)
    })

    d3.select("#bar-average").on('stepout', function(d) {
      /* What do we do when we leave the bar area? */


    })
  }

})();









