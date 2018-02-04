function isScrolledIntoView(elem) {
    var $window = $(window),
        docViewTop = $window.scrollTop(),
        docViewBottom = docViewTop + $window.height(),
        elemTop = $(elem).offset().top,
        elemBottom = elemTop + $(elem).outerHeight();
    console.log('KKKKKK', docViewTop, docViewBottom, elemTop, elemBottom)
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(window).on("scroll", (function() {
  // Set margin, height, width
  var margin = { top: 35, left: 30, right: 30, bottom: 15},
  height = 200 - margin.top - margin.bottom,
  width = 280 - margin.left - margin.right;

  // Create the container where we will insert our SVGs
  var container = d3.select("#chart-6")
    .style("margin-left", "")
    .style("margin-right", "")
    .style("background-color", "none")

  // Create our scales
  var xPositionScale = d3.scaleLinear()
    .range([0, width])
  var yPositionScale = d3.scaleLinear()
    .range([height, 0])

  // Read the file
  d3.queue()
    .defer(d3.csv, "csv/04_GTD-2013-2016_v05-AllCountries-per-Population-13-16.csv")
    .await(ready)

  function ready(error, datapoints) {
    var casualties2013Max = d3.max(datapoints, function(d){
      return ((+d.nkill_2013 + +d.nwound_2013) / d.population_2016) * 100000
    })

    var casualties2016Max = d3.max(datapoints, function(d){
      return ((+d.nkill_2016 + +d.nwound_2016) / d.population_2016) * 100000
    })

    var casualtiesMax
    if (casualties2013Max >= casualties2016Max) {
      casualtiesMax = casualties2013Max
    } else {
      casualtiesMax = casualties2016Max
    }

    var killsPerPopMax = d3.max(datapoints, function(d){
      return +d.kills_per_pop
    })

    yPositionScale
      .domain([0, casualtiesMax])

    // Append one SVG for each year
    container.selectAll("svg")
      .data(datapoints)
      .enter().append("svg")
      .attr("class", function(d){
        return "svg-" + d.regions.replace("\&","").replace(/ /g, "")
      })
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", (width + margin.left + margin.right)/2)
      .append("g")
      .attr("transform", "translate(0,0)")
      // Create the loop of our small multiples
      .each(function(d){
        // Define SVG
        var svg = d3.select(this)

        // Insert text of year
        svg.append("text")
          .attr("class", "multiples-title")
          .text(d.country_txt)
          .attr("x", width/3)
          .attr("y", 25)
          .attr("text-anchor", "middle")


        // Insert axes
        // var xAxis = d3.axisBottom(xPositionScale)
        //   .tickValues([15,30,45])
        // svg.append("g")
        //   .attr("class", "axis x-axis")
        //   .attr("transform", "translate(0," + height + ")")
        //   .call(xAxis);

        var tickValuesArray = Array.apply(10, {length: 8}).map(function(value, index){
          return 0 + index * 10;
        });
        //console.log(tickValuesArray)

        var yAxisLeft = d3.axisLeft(yPositionScale).tickSize(0)
          .tickValues(tickValuesArray)
          //.tickFormat(d3.formatPrefix(".1", 1e2))
        svg.append("g")
          .attr("class", "axis y-axis")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(yAxisLeft);

        var yAxisRight = d3.axisRight(yPositionScale).tickSize(0)
          .tickValues(tickValuesArray)
        var yAxisRightxPosition = margin.right + width/2.8
        svg.append("g")
          .attr("class", "axis y-axis")
          .attr("transform", "translate(" + yAxisRightxPosition + "," + margin.top + ")")
          .call(yAxisRight)
          .attr("opacity", "")


        var casualties2013 = ((+d.nkill_2013 + +d.nwound_2013) / d.population_2016) * 100000
        var casualties2016 = ((+d.nkill_2016 + +d.nwound_2016) / d.population_2016) * 100000
        var casualtiesDiffColor

        if (casualties2013 === casualties2016 === 0) {
          casualtiesDiffColor = 'green'
        } else if (casualties2013 <= casualties2016) {
          casualtiesDiffColor = 'red'
        } else {
          casualtiesDiffColor = 'green'
        }

        svg.append("circle")
          .attr("class", "circle-victims-2013")
          .attr("cx", margin.left)
          .attr("cy", yPositionScale(casualties2013) + margin.top)
          .attr("r", 2)
          .attr("fill", casualtiesDiffColor)

        svg.append("circle")
          .attr("class", "circle-victims-2016")
          .attr("cx", margin.right + width/2.8)
          .attr("cy", yPositionScale(casualties2016) + margin.top)
          .attr("r", 2)
          .attr("fill", casualtiesDiffColor)

        svg.append("line")
          .attr("class", "line-victims-diff")
          .attr("x1", margin.left)
          .attr("y1", yPositionScale(casualties2013) + margin.top)
          .attr("x2", margin.right + width/2.8)
          .attr("y2", yPositionScale(casualties2016) + margin.top)
          .attr("stroke", casualtiesDiffColor)

        svg.append("text")
          .attr("class", "multiples-title")
          .text("2013")
          .attr("x", margin.left)
          .attr("y", height + margin.top + margin.bottom)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)


        svg.append("text")
          .attr("class", "multiples-title")
          .text("2016")
          .attr("x", margin.right + width/2.8)
          .attr("y", height + margin.top + margin.bottom)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
      })

    //inside d3 function, outside of each
    d3.select("#Europe")
      .on("click", function(d){
        container.selectAll([".svg-Asia, .svg-AfricaMiddleEast, .svg-NorthCentralAmerica, .svg-SouthAmerica, .svg-AustralasiaOceania"])
          .hide()
      })
    
    d3.select("#Asia")
      .on("click", function(d){
        container.selectAll([".svg-EuropeRussia, .svg-AfricaMiddleEast, .svg-NorthCentralAmerica, .svg-SouthAmerica, .svg-AustralasiaOceania"])
          .remove()
      })

    d3.select("#Africa")
      .on("click", function(d){
        container.selectAll([".svg-EuropeRussia, .svg-Asia, .svg-NorthCentralAmerica, .svg-SouthAmerica, .svg-AustralasiaOceania"])
          .remove()
      })

    d3.select("#America")
      .on("click", function(d){
        container.selectAll([".svg-EuropeRussia, .svg-Asia, .svg-AfricaMiddleEast, .svg-SouthAmerica, .svg-AustralasiaOceania"])
          .remove()
      })
      
    

  }
  
})

);





