/*********
*
* D3 example #02:
* Using the margin convention
* Circles
* Dynamic SVG insertion
* Reading in external data
* selectAll/append/etc
*
*********/

(function () {

  /*
   
   WE WILL USE THIS CODE LATER, LEAVE IT COMMENTED OUT FOR NOW

  */

  // Always cut and paste this code to get a height and width
  // with some nice padding around the edges
  var margin = { top: 100, left: 50, right: 50, bottom: 50},
      height = 800 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var width = 800,
  //     height = 400;

  // // Create the SVG
  // var svg = d3.select("#chart")
  //   .append("svg")
  //   .attr("height", height)
  //   .attr("width", width)

  // Read in some external data. When we're done, run the function 'ready'

  // death rate
  var xPositionScale = d3.scaleLinear()
    .domain([0, 50000])
    .range([0, width])

  // life expectancy
  var yPositionScale = d3.scaleLinear()
    .domain([30, 85])
    .range([height, 0])

  var colorScale = d3.scaleOrdinal()
    .range(['blue', 'red', 'green', 'yellow', 'orange', 'purple'])

  // Make a queue of things to do
  // The first is: use d3.csv to read in countries.csv
  // and when you're done, go run ready
  d3.queue()
    .defer(d3.csv, "countries.csv")
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
        return xPositionScale(d['GDP_per_capita'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d['life_expectancy'])
      })
      .attr("fill", function(d) {
        return colorScale(d['Continent'])
      })

    // Always cut and paste the code for the axes, too!

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  }

})()