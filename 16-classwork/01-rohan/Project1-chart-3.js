(function() {
  var margin = { top: 60, left: 100, right: 120, bottom: 30},
  height = 430 - margin.top - margin.bottom,
  width = 850 - margin.left - margin.right;

  console.log("Building chart 3");

  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var xPositionScale = d3.scaleTime().domain([2000,2014]).range([0, width]);
		var yPositionScale = d3.scaleLinear().range([height,0])
		var colorScale = d3.scaleOrdinal()
		    .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','pink','brown'])
		// Now we read in our data
	  // with .defer, this time we're adding a THIRD argument
	  // instead of just.defer(d3.csv, "AAPL.csv")
	  // it does converting and cleaning of each data point
	  // as we read it in
		//parsing time
		var parseTime = d3.timeParse("%Y")
		var line = d3.line()
		    .x(function(d) {
		      return xPositionScale(d.datetime)
		    })
		    .y(function(d) {
		      return yPositionScale(d.alcohol_per_capita_in_litres)
		    })


	// Read in files
	  d3.queue()
	    .defer(d3.csv, "alcohol-consumption.csv",function(d){
	      d.datetime = parseTime(d.year)
	      return d;
	    })
	    .await(ready);
	  function ready(error, datapoints) {

			var filtered = datapoints.filter(function(d) {
				return d['BeverageTypes'] === 'All types'
			})
	    // Update your scales
			var dates = filtered.map(function(d) { return d.datetime })
	    var litres = filtered.map(function(d) { return +d.alcohol_per_capita_in_litres })

	    var dateMax = d3.max(dates)
	    var dateMin = d3.min(dates)
			xPositionScale.domain([dateMin, dateMax])

			var litreMax = d3.max(litres)
	    var litreMin = d3.min(litres)
			yPositionScale.domain([litreMin,litreMax])

			// nesting data by REGION
	    var nested = d3.nest()
	    .key(function(d) {
	    	return d.Country
	    })
	    .entries(filtered)

			//console.log(nested)

			svg.selectAll("path")
	      .data(nested)
	      .enter().append("path")
	      .attr("d", function(d) {
	        return line(d.values)
	      })
	      .attr("stroke", function(d) {
	        return colorScale(d.key)
	      })
	      .attr("stroke-width", 2)
	      .attr("fill", "none")


		// write text label for the last dots of each of the line plots
      svg.selectAll("text")
      	.data(nested)
      	.enter().append("text")
      	.attr("font-size", "11px")
      	.text(function(d) {
      		return d.key
      	})
        //extract the date using first value of each key(last label)
      	.attr("x", function(d) {
      		return xPositionScale(d.values[0].datetime)
      	})
        //extract the price using first value of each key (last label)
      	.attr("y", function(d) {
					if (d.key ==="Australia"){
						return 180
					}
					if (d.key ==="Denmark"){
						return 190
					}
					if (d.key ==="Switzerland"){
						return 200
					}

      		return yPositionScale(d.values[0].alcohol_per_capita_in_litres)
      	})
      	.attr("dx", 5)
      	.attr("dy", 5)

// Adding title

    svg.append("text")
      .text("Alcohol consumptions(in litres per capita)")
      .attr("x", width / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .attr("font-size", "28px")


    // Add your axes


		var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%Y"));

		svg.append("g")
			.attr("class", "axis x-axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

		var yAxis = d3.axisLeft(yPositionScale)
		svg.append("g")
			.attr("class", "axis y-axis")
			.call(yAxis);
    }
})();
