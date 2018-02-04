(function() {
  var margin = { top: 55, left: 100, right: 200, bottom: 30},
    height = 14005 - margin.top - margin.bottom,
    width = 755 - margin.left - margin.right;

  var svg = d3.select("#chart-2")
    .append("svg")
  	.attr("height", height + margin.top + margin.bottom)
  	.attr("width", width + margin.left + margin.right)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear()
  	.domain([0, 20520])
    .range([0, width])
  var yPositionScale = d3.scaleBand()
    .range([height, 0])

  d3.queue()
    .defer(d3.csv, "County_Population_Density.csv", function(d) {
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {

    var tooltip_div = d3.select("body").append("div") 
      .attr("class", "tooltip");

    var counties = datapoints.map(function(d){
      return d.CHSI_County_Name
    })
    var county_population = datapoints.map(function(d){
      return +d['Max_Population_Density']
    })
    var maxPopulation = d3.max(county_population)
    yPositionScale.domain(counties)
    xPositionScale.domain([0, maxPopulation])

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    svg.selectAll(".connector")
      .data(datapoints)
      .enter().append("line")
      .attr("class", "connector")
      .attr("stroke-width", 2)
      .attr("stroke", "grey")
      .attr("x1", function(d){
        return xPositionScale(d['Min_Population_Density'])
      })
      .attr("y1", function(d){
        return yPositionScale(d.CHSI_County_Name)
      })
      .attr("x2", function(d){
        return xPositionScale(d['Max_Population_Density'])
      })
      .attr("y2", function(d){
        return yPositionScale(d.CHSI_County_Name)
      })

    svg.selectAll(".MinPD")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "MinPD")
      .attr("r", 7)
      .attr("cx", function(d) {
        return xPositionScale(d['Min_Population_Density'])
      })
      .attr("cy", function(d) {
        // console.log(d.CHSI_County_Name)
        // console.log(yPositionScale(d.CHSI_County_Name))
        return yPositionScale(d.CHSI_County_Name)
      })
      .attr("fill", 'pink')
      .attr("opacity", 0.5)
      .on("mouseover", function(d, i){
        var d3_select_this = d3.select(this);
        d3_select_this
          .classed("selected", true)
          .attr("opacity", 0.9)
          .attr("fill", "red")
        d = d3_select_this.data()[0];
        var dummy = d3_select_this.attr( "dummy_1" )
        var num   = d3_select_this.attr( "dummy_2" )
        tooltip_div
          .classed("selected", true)
          .html(
            "<span style='color:gray;font-weight:bold;'>County:</span> " + d["CHSI_County_Name"]
            + "<br/>"
            + "<span style='color:gray;font-weight:bold;'>Minimum Population Density :</span> " + d["Min_Population_Density"])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d, i){
        d3.select(this)
          .classed("selected", false)
          .attr("opacity", 0.5)
          .attr("fill", "pink")
        tooltip_div
          .classed("selected", false)})

    svg.selectAll(".MaxPD")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "MaxPD")
      .attr("r", 7)
      .attr("cx", function(d) {
        return xPositionScale(d['Max_Population_Density'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d.CHSI_County_Name)
      })
      .attr("fill", 'lightblue')
      .attr("opacity", 0.5)
      .on("mouseover", function(d, i){
        var d3_select_this = d3.select(this);
        d3_select_this
          .classed("selected", true)
          .attr("opacity", 0.9)
          .attr("fill", "red")
        d = d3_select_this.data()[0];
        var dummy = d3_select_this.attr( "dummy_1" )
        var num   = d3_select_this.attr( "dummy_2" )
        tooltip_div
          .classed("selected", true)
          .html(
            "<span style='color:gray;font-weight:bold;'>County:</span> " + d["CHSI_County_Name"]
            + "<br/>"
            + "<span style='color:gray;font-weight:bold;'>Maximum Population Density :</span> " + d["Max_Population_Density"])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px")
      })
      .on("mouseout", function(d, i){
        d3.select(this)
          .classed("selected", false)
          .attr("opacity", 0.5)
          .attr("fill", 'lightblue');
        tooltip_div
          .classed("selected", false)})


    svg.selectAll(".GapPD")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "GapPD")
      .attr("r", 7)
      .attr("cx", function(d) {
        return xPositionScale(d['Population_gap'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d.CHSI_County_Name)
      })
      .attr("fill", 'green')
      .attr("opacity", 0.5)
      .on("mouseover", function(d, i){
        var d3_select_this = d3.select(this);
        d3_select_this
          .classed("selected", true)
          .attr("opacity", 0.9)
          .attr("fill", "red")
        d = d3_select_this.data()[0];
        var dummy = d3_select_this.attr( "dummy_1" )
        var num   = d3_select_this.attr( "dummy_2" )
        tooltip_div
          .classed("selected", true)
          .html(
            "<span style='color:gray;font-weight:bold;'>County:</span> " + d["CHSI_County_Name"]
            + "<br/>"
            + "<span style='color:gray;font-weight:bold;'>Gap between Max and Min Population Density :</span> " + d["Population_gap"])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d, i){
        d3.select(this)
          .attr("opacity", 0.5)
          .attr("fill", "green")
          .classed("selected", false);
        tooltip_div
          .classed("selected", false)})

    svg.selectAll(".AvgPD")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "AvgPD")
      .attr("r", 7)
      .attr("cx", function(d) {
        return xPositionScale(d['Population_Density'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d.CHSI_County_Name)
      })
      .attr("fill", 'orange')
      .attr("opacity", 0.5)
      .on("mouseover", function(d, i){
        var d3_select_this = d3.select(this);
        d3_select_this
          .classed("selected", true)
          .attr("opacity", 0.9)
          .attr("fill", "red")
        d = d3_select_this.data()[0];
        var dummy = d3_select_this.attr( "dummy_1" )
        var num   = d3_select_this.attr( "dummy_2" )
        tooltip_div
          .classed("selected", true)
          .html(
            "<span style='color:gray;font-weight:bold;'>County:</span> " + d["CHSI_County_Name"]
            + "<br/>"
            + "<span style='color:gray;font-weight:bold;'>Average Population Density :</span> " + d["Population_Density"])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d, i){
        d3.select(this)
          .classed("selected", false)
          .attr("opacity", 0.5)
          .attr("fill", "orange");
        tooltip_div
          .classed("selected", false)})

  }
})();