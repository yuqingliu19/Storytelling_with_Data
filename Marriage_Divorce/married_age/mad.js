(function() {
  var margin = {top: 50, right: 70, bottom: 40, left: 70},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // We'll set the domain once we've read in
  // the data
  var xPositionScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

  var yPositionScale = d3.scaleLinear()
    .range([height, 0]);

  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.csv, "data/mad.csv")
    .await(ready)

  function ready(error, datapoints) {

    var area = datapoints.map(function(d) { return d.area; })
    xPositionScale.domain(area);

    var RateMax_m = d3.max(datapoints, function(d) { return d.percentage_m; })
    yPositionScale.domain([0, RateMax_m]);

    var RateMax_u = d3.max(datapoints, function(d) { return d.percentage_u; })
    yPositionScale.domain([0, RateMax_u]);


    svg.selectAll(".bar")
        .data(datapoints)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
          return xPositionScale(d.area); 
        })
        .attr("y", function(d) { 
          return yPositionScale(d.percentage_u); 
        })
        .attr("width", xPositionScale.bandwidth())
        .attr("height", function(d) { 
          return height - yPositionScale(d.percentage_u); 
        })

    svg.selectAll(".bar")
        .data(datapoints)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
          return xPositionScale(d.area); 
        })
        .attr("y", function(d) { 
          return yPositionScale(d.percentage_m); 
        })
        .attr("width", xPositionScale.bandwidth())
        .attr("height", function(d) { 
          return height - yPositionScale(d.percentage_m); 
        })

    svg.selectAll(".bar")
        .data(datapoints)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
          return xPositionScale(d.area); 
        })
        .attr("y", function(d) { 
          return yPositionScale(d.percentage_d); 
        })
        .attr("width", xPositionScale.bandwidth())
        .attr("height", function(d) { 
          return height - yPositionScale(d.percentage_d); 
        })

    // svg.append("text")
    //   .text("marital status")
    //   .attr("x", width / 2)
    //   .attr("y", -15)
    //   .attr("text-anchor", "middle")
    //   .attr("font-weight", "bold")
    //   .attr("font-size", 20)

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
      .tickFormat(d3.format(".0%"))

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    d3.select("#unmarried-sorter")
      .on('click', function() {
        // STEP ONE: Update our scale
        // 1 is 100%
        yPositionScale.domain([0, 1])

        // STEP TWO: Update our visual elements
        // Any attribute that uses the updated scale
        svg.selectAll(".bar")
          .transition()
          .attr("height", function(d) {
            return height - yPositionScale(d.percentage_u); 
          })
          .attr("y", function(d) { 
            return yPositionScale(d.percentage_u); 
          })

        // Update our axis
        // Why like this?
        // Because that's how it works
        svg.select(".y-axis")
          .transition()
          .call(yAxis)
      })

    d3.select("#married-sorter")
      .on('click', function() {
        // STEP ONE: Update our scale
        // 1 is 100%
        yPositionScale.domain([0, 1])

        // STEP TWO: Update our visual elements
        // Any attribute that uses the updated scale
        svg.selectAll(".bar")
          .transition()
          .attr("height", function(d) {
            return height - yPositionScale(d.percentage_m); 
          })
          .attr("y", function(d) { 
            return yPositionScale(d.percentage_m); 
          })

        // Update our axis
        // Why like this?
        // Because that's how it works
        svg.select(".y-axis")
          .transition()
          .call(yAxis)
      })

    d3.select("#divorced-sorter")
      .on('click', function() {
        // STEP ONE: Update our scale
        // 1 is 100%
        yPositionScale.domain([0, frequencyMax])

        // STEP TWO: Update our visual elements
        // Any attribute that uses the updated scale
        svg.selectAll(".bar")
          .transition()
          .attr("height", function(d) {
            return height - yPositionScale(d.percentage_d); 
          })
          .attr("y", function(d) { 
            return yPositionScale(d.percentage_d); 
          })

        // Update our axis
        // Why like this?
        // Because that's how it works
        svg.select(".y-axis")
          .transition()
          .call(yAxis)
      })

    d3.select("#unmarried-sorter")
      .on('click', function() {

        // take our datapoints
        // make a copy - .slice()
        // and then sort them - .sort(function(a, b) { })

        var sorted = datapoints.slice().sort(function(a, b) {
          return b.percentage_u - a.percentage_u
        })

        // make a list of letters, but now they're SORTED
        var area = sorted.map(function(d) { return d.area; })
        xPositionScale.domain(area);

        // So hey, bars!
        // Have a new x! We updated our scale!
        svg.selectAll(".bar")
          .transition()
          .duration(1000)
          .attr("x", function(d) {
            return xPositionScale(d.area);
          })

        // Update the x axis
        svg.select(".x-axis")
          .transition()
          .duration(1000)
          .call(xAxis)
      })

   d3.select("#married-sorter")
      .on('click', function() {

        // take our datapoints
        // make a copy - .slice()
        // and then sort them - .sort(function(a, b) { })

        var sorted = datapoints.slice().sort(function(a, b) {
          return b.percentage_m - a.percentage_m
        })

        // make a list of letters, but now they're SORTED
        var area = sorted.map(function(d) { return d.area; })
        xPositionScale.domain(area);

        // So hey, bars!
        // Have a new x! We updated our scale!
        svg.selectAll(".bar")
          .transition()
          .duration(1000)
          .attr("x", function(d) {
            return xPositionScale(d.area);
          })

        // Update the x axis
        svg.select(".x-axis")
          .transition()
          .duration(1000)
          .call(xAxis)
      })

   // d3.select("#married-sorter")
   //    .on('click', function() {

   //      // take our datapoints
   //      // make a copy - .slice()
   //      // and then sort them - .sort(function(a, b) { })
   //      var sorted = datapoints.slice().sort(function(a, b) {
   //        if(a.letter > b.letter) {
   //          return 1
   //        }
   //        if(b.letter > a.letter) {
   //          return -1
   //        }
   //        return 0
   //      })

   //      // make a list of letters, but now they're SORTED
   //      var letters = sorted.map(function(d) { return d.letter; })
   //      xPositionScale.domain(letters);

   //      // So hey, bars!
   //      // Have a new x! We updated our scale!
   //      svg.selectAll(".bar")
   //        .transition()
   //        .duration(1000)
   //        .attr("x", function(d) {
   //          return xPositionScale(d.letter);
   //        })

   //      // Update the x axis
   //      svg.select(".x-axis")
   //        .transition()
   //        .duration(1000)
   //        .call(xAxis)
   //    })

   d3.select("#divorced-sorter")
      .on('click', function() {

        // take our datapoints
        // make a copy - .slice()
        // and then sort them - .sort(function(a, b) { })

        var sorted = datapoints.slice().sort(function(a, b) {
          return b.percentage_d - a.percentage_d
        })

        // make a list of letters, but now they're SORTED
        var area = sorted.map(function(d) { return d.area; })
        xPositionScale.domain(area);

        // So hey, bars!
        // Have a new x! We updated our scale!
        svg.selectAll(".bar")
          .transition()
          .duration(1000)
          .attr("x", function(d) {
            return xPositionScale(d.area);
          })

        // Update the x axis
        svg.select(".x-axis")
          .transition()
          .duration(1000)
          .call(xAxis)
      })

  };

})();
