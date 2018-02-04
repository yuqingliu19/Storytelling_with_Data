(function() {
  var margin = { top: 60, left: 100, right: 30, bottom: 30},
  height = 430 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1a")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale = d3.scaleBand().range([ 0,width])
  var yPositionScale = d3.scaleLinear().range([height,0])
  var colorScale = d3.scaleOrdinal()
      .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a',"brown"])

  // Now we read in our data
  // with .defer, this time we're adding a THIRD argument
  // instead of just.defer(d3.csv, "AAPL.csv")
  // it does converting and cleaning of each data point
  // as we read it in
  // Read in files
  d3.queue()
    .defer(d3.csv, "airline-safety.csv",function(d){
      d.diff = d.incidents_00_14 - d.incidents_85_99
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {
    // Update your scales
    var airlines = datapoints.map(function(d) { return d.airline })
    xPositionScale.domain(airlines)

    var diff = datapoints.map(function(d) { return +d.diff})

    var diffMax = d3.max(diff)
    var diffMin = d3.min(diff)
    console.log(datapoints)
    //console.log(diffMin)
    //console.log(diffMax)
    //yPositionScale.domain([diffMin,diffMax])
    yPositionScale.domain([-25,10])


    // Draw your dots
    svg.selectAll(".bars")
      .data(datapoints)
      .enter().append("rect")
      .attr("class", "bars")
      .attr("fill", function(d){
        if (d.airline === "Ethiopian Airlines"){
          return "red" }
          else { return  "grey"}


      })
      .attr("y", function(d) {

            if (d.diff > 0){
                return yPositionScale(d.diff)
            } else {
                return yPositionScale(0)
            }

        })

      // .attr('y', function (d) {return yPositionScale(Math.min(0, d.diff));})
      .attr("x", function(d) {
        return xPositionScale(d.airline)
      })

      .attr("width", 55)
      .attr("height", function(d) {
            return Math.abs(yPositionScale(d.diff) - yPositionScale(0));
        })

// Adding title

    svg.append("text")
      .text("Airline Incidents in Period 1985-1999")
      .attr("x", width / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .attr("font-size", "28px")


    // Add your axes

// Wrap function for long labels
    var xAxis = d3.axisBottom(xPositionScale);
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.2, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + yPositionScale(0) + ")")
      .call(xAxis)
      .selectAll(".tick text")
      .call(wrap, xPositionScale.bandwidth());





    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")

      .call(yAxis);
    }
})();
