(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal().range(['#7fc97f', '#ffff99', '#fdc086'])

  var xPositionScale = d3.scalePoint().domain(["Project 1", "Project 2", "Project 3", "Project 4"])
    .range([0, width])
    .padding(20)

  var radius = 50;

  var pie = d3.pie()
    .value( function(d){
      return d.minutes;
    })

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  d3.queue()
    .defer(d3.csv, "data/time-breakdown-all.csv")
    .await(ready)

  function ready(error, datapoints) {

    var nested = d3.nest()
      .key( function(d) {
        return d.project;
      })
      .entries(datapoints);

    var multiples = svg.selectAll("g")
      .data(nested)
      .enter().append("g")
      .attr("transform", function(d) {
        var xPosition = xPositionScale(d.key);
        return "translate(" + xPosition + ",150)"
      })

    multiples.each( function (d) {

      d3.select(this).append('text')
        .attr("y", +80)
        .attr("text-anchor", "middle")
        .text(d.key)

      d3.select(this).selectAll("path")
      .data(pie(d.values))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", function(d){
        return colorScale(d.data.task);
      })


    })

  }
})();



