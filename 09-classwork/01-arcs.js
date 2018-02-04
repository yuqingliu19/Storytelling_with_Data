(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var holder = svg.append('g')
    .attr('transform', 'translate(200,200)')
  //arc generator
  var arc = d3.arc()
    .startAngle(3 * Math.PI / 2)
    .endAngle(Math.PI / 2)
    .innerRadius(50)
    .outerRadius(70)
  
  holder.append('path')
    .attr('d', arc)
    .attr('fill', 'darkgrey')
   


})();