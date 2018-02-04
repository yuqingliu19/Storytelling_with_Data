(function() {
  var margin = { top: 30, left: 30, right: 100, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 500 - margin.left - margin.right;

  console.log("Building chart 2");

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create your scales
  var xPositionScale = d3.scalePoint()
    .domain(['1980', '2010'])
    .range([0, width])
  var yPositionScale = d3.scaleLinear().domain([0, 70]).range([height, 0])
  var colorScale = d3.scaleOrdinal()
    .domain(["20-24", "25-29"])
    .range(['#de2d26','#de2d26'])

  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.year)
    })
    .y(function(d) {
      return yPositionScale(d.percentage)
    })

  d3.queue()
    .defer(d3.csv, "data/marryagefemale.csv")
    .await(ready)


  // Import your data file using d3.queue()

  function ready(error, datapoints) {

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", function(d){
        return d.age
      })
      .attr("r", 4)
      .attr("cx", function(d) {
        return xPositionScale(d.year)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.percentage)
      })
      .attr("fill", function(d) {
        return colorScale(d.age)
      })


    var nested = d3.nest()
      .key(function(d) {
        return d.age
      })
      .entries(datapoints)

    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("class", function(d){
        return d.key
      })
      .attr("stroke", function(d) {
        return colorScale(d.key)
      })
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("d", function(d) {
        return line(d.values)
      })

    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .attr("class", function(d){
        return d.key
      })
      .attr("font-size", 12)
      .attr("fill", '#333333')
      .attr("x", xPositionScale('2010'))
      .attr("dx", 5)
      .attr("y", function(d) {
        console.log(d.values[1].percentage)
        return yPositionScale(d.values[1].percentage)
      })
      .text(function(d) {
        return d.values[1].percentage + " " + d.key
      })
      // .attr("dy", function(d) {
      //   if(d.key === "30-34") {
      //     return 18
      //   }
      //   if(d.key === "40-44") {
      //     return -12
      //   }
      //   return 3
      // })
      // .on("mouseover", function(d){
      //   class_needed = '.' + d.key
      //   texts = d3.selectAll("text" + class_needed)
      //   circles = d3.selectAll("circle" + class_needed)
      //   paths = d3.selectAll("path" + class_needed)
      //   texts.attr("fill", "red")
      //   circles.attr("fill", "red")
      //   paths.attr("stroke", "red")
      // })

      // .on("mouseout", function(d){
      //     class_needed = '.' + d.key
      //     texts.attr("fill", "#333333")
      //     circles.attr("fill", function(d){
      //       return colorScale(d.age)
      //     })
      //     paths.attr("stroke", function(d){
      //       return colorScale(d.key)
      //     })
      // })
      
    var xAxis = d3.axisBottom(xPositionScale)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .lower() // move to the bottom of the stack

    var yAxis = d3.axisLeft(yPositionScale)
      .tickValues([20, 40, 60, 80])
      .tickSize(-width)

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)
      .lower() // move to the bottom of the stack

    svg.selectAll(".y-axis path").remove()
    svg.selectAll(".y-axis text").remove()
    svg.selectAll(".y-axis line")
          .attr("stroke-dasharray", 2)
          .attr("stroke", "grey")

    }
})();