(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#chart-5")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create any scales you might need
  var xPositionScale = d3.scaleLinear().domain([1,25]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0,50]).range([height, 0]);

  // Create color scale

  // Create line function
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.day)
    })
    .y(function(d) {
      return yPositionScale(d.temperature)
    })

  // Read in data with multiple countries
  d3.queue()
    .defer(d3.csv, "data-multiline.csv")
    .await(ready);

  function ready(error, datapoints) {

    // We are going to group by d.country column
    // key = column you are grouping by
    // entries = the data we want to group
    var nested = d3.nest()
      .key(function(d) {
        return d.country
      })
      .entries(datapoints)

    // Create and style your lines
    // console.log(nested)

    // Add circles if you feel like it
    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", function(d) {
        // hey magic line function
        // I'm going to give you a bunch of data now
        return line(d.values)
      })


    // Add annotations at the end of the lines


    // Make sure everything is colored appropriately


    // Add in your axes
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