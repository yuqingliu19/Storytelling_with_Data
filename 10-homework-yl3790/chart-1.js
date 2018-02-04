(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal().range(['#7fc97f', '#ffff99', '#fdc086'])

  var radius = 100;

  var pie = d3.pie()
    .value( function(d){
      return d.minutes;
    })

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  var labelArc = d3.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius - 40);
  
  d3.queue()
    .defer(d3.csv, "data/time-breakdown.csv")
    .await(ready)

  function ready(error, datapoints) {
   
  var pieContainer = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

  pieContainer.selectAll("path")
      .data(pie(datapoints))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", function(d){
        return colorScale(d.data.task);
      })

  pieContainer.selectAll("text")
      .data(pie(datapoints))
      .enter().append("text")
      .attr("d", labelArc)
      .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")";
      })
      .text(function(d){
        return d.data.task
      })
      .attr("text-anchor", function(d) {
        if(d.startAngle > Math.PI) {
          return "end"
        } else {
          return "start"
        }
      })
      
      .attr("x", function(d){
        return labelArc.centroid(d)[0]
      })
      .attr("y", function(d){
        return labelArc.centroid(d)[1]
      })


  }
})();



