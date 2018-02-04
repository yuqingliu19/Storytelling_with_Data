(function () {

  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // death rate
  var xPositionScale = d3.scaleLinear()
    .domain([0, 50000])
    .range([0, width])

  // life expectancy
  var yPositionScale = d3.scaleLinear()
    .domain([30, 85])
    .range([height, 0])

  var colorScale = d3.scaleOrdinal()
    .range(['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f'])

  // Make a queue of things to do
  // The first is: use d3.csv to read in countries.csv
  // and when you're done, go run ready
  d3.queue()
    .defer(d3.csv, "data/countries.csv")
    .await(ready)

  // This is 'ready':
  // it receives an error (if there is one)
  // and datapoints, our newly-read-in data

  function ready(error, countries) {
    // GDP_per_capita,life_expectancy
    svg.selectAll("circle")
      .data(countries)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) {
        return xPositionScale(d.gdp_per_capita)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.life_expectancy)
      })
      .attr("fill", function(d) {
        return colorScale(d.continent)
      })
      .attr("opacity", 0.5)

    // Always cut and paste the code for the axes, too!

    svg.append("text")
      .text("Life Expectancy vs. GDP")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 24)

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var xAxis = d3.axisBottom(xPositionScale)
      .tickFormat(d3.format("$,d"))

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Reset everything to normal
    d3.select("#all-btn")
      .on('click', function() {
        svg.selectAll("circle")
          .transition(750)
          .attr("r", 5)
          .attr("opacity", 0.5)
      })

    // When clicked, non-Africa
    // circles should disappear
    d3.select("#africa-btn")
      .on('click', function() {
        // grab all the circles
        // change their opacity
        svg.selectAll("circle")
          .transition()
          .attr("opacity", function(d) {
            // are you Africa?
            // if yes, we can see you
            // if no, we can't
            if(d.continent === "Africa") {
              return 0.5
            } else {
              return 0
            }
          })
      })

    // When clicked, non-South American
    // circles should become r=0
    d3.select("#sa-btn")
      .on('click', function() {

        // Make all circles r=0
        svg.selectAll("circle")
          .transition()
          .duration(500)
          .attr("r", 0)

        // Make African circles r=5
        svg.selectAll("circle")
          .filter(function(d) {
            return d.continent === 'S. America'
          })
          .transition()
          .duration(500)
          .attr("r", 5)

      })


  }

})()

