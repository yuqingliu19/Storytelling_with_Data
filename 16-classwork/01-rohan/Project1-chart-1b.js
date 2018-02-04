(function() {
  var margin = { top: 60, left: 100, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1b")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale = d3.scaleBand().range([ 0,width])
  var yPositionScale = d3.scaleLinear().domain([0,30]).range([height,0])
  var colorScale = d3.scaleOrdinal()
      .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a',"brown"])

  // Now we read in our data
  // with .defer, this time we're adding a THIRD argument
  // instead of just.defer(d3.csv, "AAPL.csv")
  // it does converting and cleaning of each data point
  // as we read it in
  d3.queue()
    .defer(d3.csv, "airline-safety.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Update your scales
    var airlines = datapoints.map(function(d) { return d.airline })
    xPositionScale.domain(airlines)



    // Draw your dots
    svg.selectAll(".bars")
      .data(datapoints)
      .enter().append("rect")
      .attr("class", "bars")
      .attr("fill", function(d){
        return colorScale(d.airline)
      })
      .attr("y", function(d) {
        //console.log(d.datetime)
        return yPositionScale(d.incidents_00_14)
      })
      .attr("x", function(d) {
        return xPositionScale(d.airline)
      })

      .attr("width", 50)
      .attr("height", function(d){
        return height - yPositionScale(d.incidents_00_14)
      })


	// Adding title

	    svg.append("text")
	      .text("Airline Incidents in Period 2000-2014")
	      .attr("x", width / 2)
	      .attr("y", -14)
	      .attr("text-anchor", "middle")
	      .attr("font-size", "28px")


    // Add your axes

	// Wrap function for long labels
	    var xAxis = d3.axisBottom(xPositionScale);
	    function wrap(text, width) {
	      text.each(function() {
	        var text = d3.select(this),
	            words = text.text().split(/\s+/).reverse(),
	            word,
	            line = [],
	            lineNumber = 0,
	            lineHeight = 1.1, // ems
	            y = text.attr("y"),
	            dy = parseFloat(text.attr("dy")),
	            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	        while (word = words.pop()) {
	          line.push(word);
	          tspan.text(line.join(" "));
	          if (tspan.node().getComputedTextLength() > width) {
	            line.pop();
	            tspan.text(line.join(" "));
	            line = [word];
	            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	          }
	        }
	      });
	    }
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll(".tick text")
      .call(wrap, xPositionScale.bandwidth());





    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")

      .call(yAxis);
    }
})();
