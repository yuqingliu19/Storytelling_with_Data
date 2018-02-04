(function() {
	var margin = { top: 30, left: 30, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 3");

	var svg = d3.select("#chart-3")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create your scales

	// Do you need a d3.line function for this? Maybe something similar?

	// Import your data file using d3.queue()

	function ready(error, datapoints) {

		// Draw your dots

		// Draw your areas

		// Add your axes
  	}
})();