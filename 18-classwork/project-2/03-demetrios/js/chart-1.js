(function() {

  var margin = { top: 30, left: 10, right: 30, bottom: 30};
  var height = 700 - margin.top - margin.bottom;

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  var svg_width = window.innerWidth;
  var width = 600 - margin.left - margin.right;
  
  var svg = d3.select("#chart-1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      //.attr("transform", "translate(" + width/2 + "," + height/2 + ")")
      .attr("transform", "translate(" + margin.left + 1 + "," + margin.bottom + ")")

  
    var xPositionScale = d3.scalePoint()
      .range([0, width - 150])

    var yPositionScale = d3.scaleLinear()
      .domain([0,280])
      .range([height, 0])


    var colorScale = d3.scaleOrdinal()
      .range(['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e','#003c30'])


    // // tooltip code -  source: http://bl.ocks.org/Caged/6476579
    // var tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .html(function(d) {
    //     return "<strong></strong>" + "<span>jijij</span>";
    //   })

    // // adds the 'concept' of tip to the SVG
    // svg.call(tip)

  d3.queue()
    .defer(d3.csv, "csv/blended-account_Expenditures-Blended_v01.csv")
    .await(ready)

  function ready(error, datapoints){
    console.log(datapoints)

    var years = datapoints.map(function(d) {
        return d.Year
      })
    console.log("Years", years)

    xPositionScale
      .domain(years)

    // Draw your areas
    var area = d3.area()
      .x0(function(d){
        return xPositionScale(d.Year)
      })
      .y0(function(d){
        return yPositionScale(0)
      })
      .x1(function(d){
        return xPositionScale(d.Year)
      })
      .y1(function(d){
        return yPositionScale(d.Value)
      })

    var nested = d3.nest()
      .key(function(d){
        return d.Blended_Account
      })
      .entries(datapoints)

      console.log("NESTED", nested)


    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d){
        return area(d.values)
      })
      .attr("fill", '#f6e8c3')
      .attr("fill-opacity", "0.55")
      .attr("stroke", 'gray')
      .attr('class', function(d){
        if (d.values[0].Value <= 20) {
          return 'circle-total-small'
        } else if (d.values[0].Value <= 80) {
          return 'circle-total-medium'
        } else {
          return 'circle-total-big'
        }
      })
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide)

    d3.selectAll('.circle-total-medium')
      .lower()
    d3.selectAll('.circle-total-big')
        .lower()
    d3.selectAll('.circle-total-small')
        .raise()





    svg.append("text")
      .data(nested)
      .enter().append("text")
      .attr("class", "text-diseases")
      .text(function(d){
        return d.key
      })
      .attr("x", width-145)
      .attr("y", function(d){
        return yPositionScale(d.values[d.values.length - 1].Value)
      })

// Add your axes
    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);


  }










})();