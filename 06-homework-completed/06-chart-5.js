(function() {
	var margin = { top: 30, left: 50, right: 30, bottom: 30},
	height = 500 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 5");

	var svg = d3.select("#chart-5")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var yPositionScale = d3.scalePoint().padding(0.5).domain(['mouse', 'cat', 'dog']).range([height, 0])
	var xPositionScale = d3.scalePoint().padding(0.5).domain(['small', 'medium', 'large']).range([0, width])
	var radiusScale = d3.scaleSqrt().domain([0, 50]).range([0, 50])

	d3.queue()
		.defer(d3.csv, "animal-sizes.csv")
		.await(ready)

	function ready(error, datapoints) {
		// Add your circles
		svg.selectAll("circle")
			.data(datapoints)
			.enter().append("circle")
			.attr("cx", function(d) {
				return xPositionScale(d.size)
			})
			.attr("cy", function(d) {
				return yPositionScale(d.breed)
			})
			.attr("r", function(d) {
				return radiusScale(d.amount)
			})
		
		var xAxis = d3.axisBottom(xPositionScale)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

	}
})();