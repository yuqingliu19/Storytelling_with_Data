(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-3-a")
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

  var radius = 170

  var radiusScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, radius])

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
      .attr("fill", "red")
      .attr("opacity", 0.5)
      .attr("stroke", "black")

    container.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 3)

    var bands = [10, 20, 30, 40, 50, 60]

    container.selectAll(".band")
      .data(bands)
      .enter().append("circle")
      .attr("class", "band")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", function(d) {
        return radiusScale(d)
      })

    container.selectAll(".band-label")
      .data(bands)
      .enter().append("text")
      .attr("class", "band-label")
      .text(function(d) {
        return d
      })
      .attr("text-anchor", "middle")
      .attr("y", function(d) {
        return -radiusScale(d)
      })
      .attr("dy", -2)
      .attr("font-size", 12)

    container.selectAll(".month-label")
      .data(months)
      .enter().append("text")
      .attr("class", "month-label")
      .text(function(d) {
        return d
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var a = angleScale(d)
        var r = radius

        return r * Math.sin(a)
      })
      .attr("y", function(d) {
        var a = angleScale(d)
        var r = radius

        return r * Math.cos(a) * -1
      })


    container.selectAll(".data-label")
      .data(datapoints)
      .enter().append("text")
      .attr("class", "data-label")
      .text(function(d) {
        return d.sales
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var a = angleScale(d.month)
        var r = radiusScale(d.sales) + 3

        return r * Math.sin(a)
      })
      .attr("y", function(d) {
        var a = angleScale(d.month)
        var r = radiusScale(d.sales) + 3

        return r * Math.cos(a) * -1
      })
      .attr("font-size", 10)


  }
})();





