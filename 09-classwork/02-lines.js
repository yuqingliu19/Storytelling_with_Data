(function() {
  var margin = { top: 50, left: 50, right: 50, bottom: 50 },
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

  var radiusScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, 150])

  var angleScale = d3.scaleBand()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .range([0, Math.PI * 2])

  var line = d3.radialline()
    .angle(function(d){
      return angleScale(d.month)
    })
    .radius(function(d){
      return radiusScale(d.sales)
    })



  d3.queue()
    .defer(d3.csv, "02-house-sales-by-month.csv")
    .await(ready)

  function ready(error, datapoints) {

    var holder = svg.append('g')
      .attr('transform', 'translate(200,200)')

    holder.append('path')
      .datum(datapoints)
      .attr('d', line)

  }
})();