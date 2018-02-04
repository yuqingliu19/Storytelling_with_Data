(function() {
    var margin = { top: 30, left: 80, right: 80, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 1280 - margin.left - margin.right;

  // What is this???
    var container = d3.select("#chart-4")
          .append("svg")
          .attr("height", height + margin.top + margin.bottom)
          .attr("width", width + margin.left + margin.right)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var pie = d3.pie()
      .value(function(d) {
        return d.alcohol_per_capita_in_litres
      })
    var parseTime = d3.timeParse("%y")
    var radius = 30

    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(40)

    var label = d3.arc()
      .outerRadius(radius )
      .innerRadius(radius );

    var colorScale = d3.scaleOrdinal()
      .range(['orange', 'cyan', 'magenta', 'mauve'])

    var sizeScale = d3.scalePoint().range([0, width ]);

    d3.queue()
	    .defer(d3.csv, "alcohol-consumption.csv")
	    .await(ready);


    function ready(error, datapoints) {

        var filtered = datapoints.filter(function(d) {
          return d['BeverageTypes'] !== 'All types' && d.year === "2014"
        })
        //console.log(filtered)
      var nested = d3.nest()
        .key(function(d) {
          return d.Country
        })
        .entries(filtered)
        console.log(filtered)
      var pies = nested.map(function(d) { return d.key })
      sizeScale.domain(pies)

      container.selectAll("g")
        .data(nested)
        .enter().append("g")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .attr("transform", function(d) {
          return "translate(" + sizeScale(d.key) + ", 180)"
        })
        .each(function(d) {
          var svg = d3.select(this)
          var datapoints = d.values
          //console.log(datapoints)

          svg.selectAll("path")
            .data(pie(datapoints))
            .enter().append("path")
            .attr("d", function(d) {
              return arc(d)
            })

            .attr("fill", function(d) {
              // your original d data is
              // hiding inside of d.data
              //console.log(d)
              return colorScale(d.data.BeverageTypes)
            })

      svg.selectAll(".task-label")
        .data(pie(datapoints))
        .enter().append("text")
        .attr("class", "task-label")
        .attr("font-size", "10px")
        .text(function(d) {
          //console.log(d)
          return d.data.BeverageTypes
        })

        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })

        //.attr("text-anchor","middle")
        .attr("text-anchor", function(d) {
        	if(d.startAngle > Math.PI) {
        	  return "end"
        	} else {
        	  return "start"
        	}
        })

        // Adding text
            svg.append("text")
              .text(d.key)
              .attr("x", 0)
              .attr("y", +100)
              .attr("fill","black")
              .attr("text-anchor", "middle")
              .attr("font-size", "14px")

          })
        }
})();
