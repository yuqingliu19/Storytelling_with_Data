(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic
  var margin = { top: 80, left: 80, right: 80, bottom: 80},
        height = 600 - margin.top - margin.bottom,
        width = 450 - margin.left - margin.right;

  var svg = d3.select("#chart8")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Build your scales here
  var widthScale = d3.scaleLinear().domain([0,10]).range([0,300])
  var colorScale = d3.scaleOrdinal().range(['#FF837F', '#9C2A52', '#9C2421'])
  var yPositionScale = d3.scaleBand()
    .range([height,0])

  d3.queue()
    .defer(d3.csv, "eating-data.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Add and style your marks here
    var names = datapoints.map(function(d) { return d.name })
    yPositionScale.domain(names)

    svg.selectAll('rect')
      .data(datapoints)
      .enter().append('rect')
      .attr('x', 10)
      .attr('y', function(d){
        return yPositionScale(d['name'])
      })
      .attr('width', function(d){
        return widthScale(d['hamburgers'])
      })
      .attr('height', 64)
      .attr('fill', function(d){
        return colorScale(d['animal'])
      })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(" + '10' + ",0)")
      .call(yAxis);

    var xAxis = d3.axisBottom(widthScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(10," + height + ")")
      .call(xAxis);

  }
})()