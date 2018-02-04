(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-6")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var pie = d3.pie()
    .value(function(d) {
      return d.amount
    })

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(200)

  var colorScale = d3.scaleOrdinal()
    .range(['pink', 'cyan', 'magenta', 'mauve'])

  d3.queue()
    .defer(d3.csv, "06-pie-data.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Build a container and move it to the middle
    // because we can't set the cx/cy on the radial
    // charts even though they're circular
    var container = svg.append("g")
      .attr("transform", "translate(200,200)")

    console.log(pie(datapoints))

    container.selectAll("path")
      .data(pie(datapoints))
      .enter().append("path")
      .attr("d", function(d) {
        return arc(d)
      })
      .attr("fill", function(d) {
        // your original d data is
        // hiding inside of d.data
        console.log(d)
        return colorScale(d.data.category)
      })

  }
})();




