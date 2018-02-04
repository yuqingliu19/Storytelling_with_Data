(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var parseTime = d3.timeParse("%b")

  var angleScale = d3.scaleBand()
    .domain(months)
    .range([0, Math.PI * 2])

  var radiusScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, 200])

  var line = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .radius(function(d) {
      return radiusScale(d.sales)
    })

  d3.queue()
    .defer(d3.csv, "02-house-sales-by-month.csv")
    .await(ready)

  function ready(error, datapoints) {
    var container = svg.append("g")
      .attr("transform", "translate(200,200)")

    console.log(datapoints)
    console.log(line)
    console.log(line(datapoints))

    datapoints.push(datapoints[0])
    
    container.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black")

    container.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 3)
  }
})();





