(function() {
  var margin = { top: 55, left: 205, right: 200, bottom: 30},
    height = 200 - margin.top - margin.bottom,
    width = 805 - margin.left - margin.right;

  var svg = d3.select("#chart-1-1")
    .append("svg")
	.attr("height", height + margin.top + margin.bottom)
	.attr("width", width + margin.left + margin.right)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear()
  	.domain([0, 15])
    .range([0, width])
  var yPositionScale = d3.scaleBand()
    .range([height, 0])

  d3.queue()
    .defer(d3.csv, "IM_race_df.csv", function(d) {
      // console.log(d.datetime)
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {

    // var Races = datapoints.map(function(d){
    //   return d.Elements
    // })
    yPositionScale.domain(["Hispanic Infant Mortality", "Black Infant Mortality", "White Infant Mortality", "Average Infant Mortality"])

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var bars = svg.append("g")
      .attr("class", "bars")

    svg.selectAll("rect")
      .data(datapoints)
      .enter().append("rect")
      .attr("height", 3)
      .attr("x", 120)
      .attr("y", function(d, i){
        return 11 + 28 * i
      // return yPositionScale(d["Races"])
      })
      .attr("width", function(d){
      return xPositionScale(d["Rate in 2003"])-120
      })
      // .attr("fill", function(d){
      //   return colorScale(d['animal']);
      // })
      .attr("opacity", 1)
      .attr("fill", function(d){
        if(d.Elements === "Black non Hispanic Infant Mortality") {
          return "#f00"
        }        
        return "#09c"})


  }
})();