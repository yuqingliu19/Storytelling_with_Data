(function() {
  var margin = { top: 60, left: 80, right: 140, bottom: 30},
  height = 430 - margin.top - margin.bottom,
  width = 820 - margin.left - margin.right;

  console.log("Building chart 2");

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale = d3.scalePoint().domain(['incidents_85_99', 'incidents_00_14']).range([0, width])

  var yPositionScale = d3.scaleLinear()
									.domain([0,28])
										.range([height,0])
  var colorScale = d3.scaleOrdinal()
                  .domain(["Air France","Air India","American","Delta / Northwest","Ethiopian Airlines","Malaysia Airlines","Pakistan International","SWISS","Thai Airways",
                    "United / Continental","US Airways / America West"])
      						.range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a',"brown"])

  // Now we read in our data
  // with .defer, this time we're adding a THIRD argument
  // instead of just.defer(d3.csv, "AAPL.csv")
  // it does converting and cleaning of each data point
  // as we read it in
  d3.queue()
    .defer(d3.csv, "airline-safety-long.csv")
    .await(ready)

    var line = d3.line()
      .x(function(d) {
        return xPositionScale(d.incidents_type)
      })
      .y(function(d) {
        return yPositionScale(d.number)
      })



  function ready(error, datapoints) {
    // Update your scales
    // var airlines = datapoints.map(function(d) { return d.airline })
    // yPositionScale.domain(airlines)
		var filtered = datapoints.filter(function(d) {
			return d['incidents_type'] === 'incidents_85_99' || d['incidents_type'] ==='incidents_00_14'
		})
		console.log(filtered)


		svg.selectAll("circle")
      .data(filtered)
      .enter().append("circle")
      // .attr("class", function(d) {
      //   return d.state.toLowerCase().replace(/[^\w]+/g,"-")
      // })
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.incidents_type)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.number)
      })
      .attr("fill", function(d) {
        return colorScale(d.airline)
      })

      var nested = d3.nest()
        .key(function(d) {
          return d.airline
        })
        .entries(filtered)

        console.log(nested)
        svg.selectAll("path")
          .data(nested)
          .enter().append("path")
          // .attr("class", function(d) {
          //   return d.key.toLowerCase().replace(/[^\w]+/g,"-")
          // })
          .attr("stroke", function(d) {
            return colorScale(d.key)
          })
          .attr("stroke-width", 1.5)
          .attr("fill", "none")
          .attr("d", function(d) {
            return line(d.values)
          })


          svg.selectAll("text")
            .data(nested)
            .enter().append("text")

            .attr("font-size", 12)
            .attr("fill", '#333333')
            .attr("x", width)
            .attr("dx", 5)
            .attr("y", function(d) {
              

              return yPositionScale(d.values[1].number)
            })
            .text(function(d) {
              return d.values[1].number + " " + d.key
            })
            .attr("dy", function(d) {

              return 3
            })


// Adding title

      svg.append("text")
        .text("Airline Incidents in Period 1985-1999 vs 2000 -2014")
        .attr("x", width / 2)
        .attr("y", -14)
        .attr("text-anchor", "middle")
        .attr("font-size", "28px")


      // Add your axes
  		var xAxis = d3.axisBottom(xPositionScale)

      svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .lower() // move to the bottom of the stack

  			var yAxis = d3.axisLeft(yPositionScale);
  	    svg.append("g")
  	      .attr("class", "axis y-axis")

  	      .call(yAxis);

      svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .lower() // move to the bottom of the stack

    // svg.selectAll(".y-axis path").remove()
    // svg.selectAll(".y-axis text").remove()
    // svg.selectAll(".y-axis line")
    //       .attr("stroke-dasharray", 2)
    //       .attr("stroke", "grey")



    }
})();
