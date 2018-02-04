(function() {

  // Don't edit any of this
  var height = 50, width = 400;

  var svg = d3.select("#chart3")
    .select("svg")
    .attr("height", height + 50)
    .attr("width", width)
    .select("g")
    .attr("transform", "translate(50, 0)")

  var data = [
    { 'name': 'Panda', 'weight': 150 },
    { 'name': 'Cat', 'weight': 8 },
    { 'name': 'Horse', 'weight': 840 },
    { 'name': 'Pig', 'weight': 100 }
  ]

  // Build your scales here
  xPosition = d3.scaleBand()
    .domain([0,1,2,3])
    .range([0,400])

  yPosition = (height + 50) / 2
  
  sizeScale = d3.scaleSqrt()
    .domain([0,1000])
    .range([0,50 ])


  // Set your attributes here
  svg.selectAll("circle")
    .data(data)
    .attr("cx", function(d, i){
      console.log('cx', xPosition(i))
      return xPosition(i)
    })
    .attr("cy", yPosition)
    .attr("r", function(d){
      console.log('r', sizeScale(d['weight']))
      return sizeScale(d['weight'])
    })
 
})()


  