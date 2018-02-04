(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic
  var margin = { top: 50, left: 50, right: 50, bottom: 50},
        height = 200 - margin.top - margin.bottom,
        width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart7")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Build your scales here
  var xPositionScale = d3.scaleLinear()
    .domain([0,10])
    .range([0,width])

  var sizeScale = d3.scaleSqrt()
    .domain([0,20])
    .range([0,70])

  var colorScale = d3.scaleOrdinal()
    .range(['red', 'blue', 'green'])


  d3.queue()
    .defer(d3.csv, "eating-data.csv")
    .await(ready)


  function ready(error, datapoints) {
    // Add and style your marks here
    svg.selectAll('circle')
      .data(datapoints)
      .enter().append('circle')
      .attr('r', function(d){
        return sizeScale(d['hotdogs'])
      })
      .attr('fill', function(d){
        return colorScale(d['animal'])
      })
      .attr('cx', function(d){
        return xPositionScale(d['hamburgers'])
      })
      .attr('cy', height/2)
      .attr('opacity', 0.25)

    var xAxis = d3.axisBottom(xPositionScale)
      svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .attr('style', 'font-size:22px;')
        .call(xAxis);

  }
})()