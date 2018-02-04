(function(){
  var widthScale = d3.scaleLinear()
  var colorScale = d3.scaleOrdinal()

  var svg = d3.select("#chart1")
  var rect = svg.select("rect")

  rect.attr('fill', colorScale('woman'))
    .attr('width', widthScale(165))

})()

