(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
  height = 500 - margin.top - margin.bottom,
  width = 600 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// '1984', '1985', '1986','1987','1988','1989','1990','1991','1992','1993','1994''1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015'
  // Create your scales
  var widthScale = d3.scaleLinear()
    .domain([1984,2016])
    .range([0, width])
  var heightScale = d3.scaleLinear()
    .domain([0, 1700])
    .range([height, 0])
  // var colorScale = d3.scaleOrdinal()
  //   .domain(["20-24", "25-29"])
  //   .range(['#3182bd','#3182bd'])

  d3.queue()
    .defer(d3.csv, "data/firetimes.csv")
    .await(ready)


  // Import your data file using d3.queue()

  function ready(error, datapoints) {

    svg.selectAll("rect")
      .data(datapoints)
      .enter().append("rect")
      .attr("x", function(d) {
        return widthScale(d.year)
      })
      .attr("y", function(d) {
        return heightScale(d.times)
      })
      .attr('height', function(d){
        return height - heightScale(d.times)
      })
      .attr('width', 10)
      .attr('fill', '#f03b20')
      
    var xAxis = d3.axisBottom(widthScale)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .lower() // move to the bottom of the stack

    var yAxis = d3.axisLeft(heightScale)
      .tickValues([200, 400, 600, 800, 1000, 1200, 1400, 1600])
      .tickSize(-width)

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)
      .lower() // move to the bottom of the stack

    svg.selectAll(".y-axis path").remove()
    // svg.selectAll(".y-axis text").remove()
    svg.selectAll(".y-axis line")
          .attr("stroke-dasharray", 1.5)
          .attr("stroke", "grey")

  }
})();
