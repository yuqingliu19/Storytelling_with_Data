(function() {
  var margin = { top: 15, left: 25, right: 10, bottom: 25},
    height = 400 - margin.top - margin.bottom,
    width = 300 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
    .append("svg")
	.attr("height", height + margin.top + margin.bottom)
	.attr("width", width + margin.left + margin.right)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint()
  	.domain([2003, 2010])
    .range([0, width])
    .padding(.15)
  var yPositionScale = d3.scaleLinear()
    .domain([0, 15])
    .range([height, 0])

  d3.queue()
    .defer(d3.csv, "IM_race_df.csv", function(d) {
      // console.log(d.datetime)
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var xShift = - margin.left + xPositionScale.step() * xPositionScale.padding();
    svg.selectAll(".connector")
      .data(datapoints)
      .enter().append("line")
      .attr("class", "connector")
      .attr("stroke-width", function(d){
      	// if(d.Elements === "Black non Hispanic Infant Mortality") {
       //    return 3
       //  }      	
      	return 3
      })
      .attr("stroke", function(d){
      	if(d.Elements === "Black non Hispanic Infant Mortality") {
          return "#f00"
        }
      	return "#09c"
  	  })
      .attr("x1", xShift+xPositionScale(2003))
      .attr("y1", function(d){
        return yPositionScale(d['Rate in 2003'])
      })
      .attr("x2", xShift+xPositionScale(2010))
      .attr("y2", function(d){
        return yPositionScale(d['Rate in 2010'])
      })
      // .attr("opacity", function(d){
      // 	if(d.Elements === "Black non Hispanic Infant Mortality") {
      //     return 1
      //   } 
      // 	return 0.5
      // })

    svg.selectAll(".Rate2003")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "Rate2003")
      .attr("r", 3)
      .attr("cx", xShift+xPositionScale(2003))
      .attr("cy", function(d) {
        return yPositionScale(d['Rate in 2003'])
      })
      .attr("fill", function(d){
      	if(d.Elements === "Black non Hispanic Infant Mortality") {
          return "#f00"
        }
      	return '#09c'
      })

    svg.selectAll(".Rate2010")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "Rate2010")
      .attr("r", 3)
      .attr("cx", xShift+xPositionScale(2010))
      .attr("cy", function(d) {
        return yPositionScale(d['Rate in 2010'])
      })
      .attr("fill", '#09c')

	var Country_text = svg.append("g")
	  .selectAll("text").data(datapoints).enter().append("text")
	  .text(function( d, i ){ return d["Elements"].toUpperCase(); })
	  .attr("x", function(d) {
      	return xShift+xPositionScale(2003);
    })
	  .attr("y", function(d){
      	if(d.Elements === "Hispanic Infant Mortality") {
          return yPositionScale(d['Rate in 2003'])+10
        } 
      	return yPositionScale(d['Rate in 2003'])-0;

    })
	  .attr("class", "cool_text")
    // .attr("fill", function(d){
    //   return colorScale(d['key']);
    // })

  }
})();