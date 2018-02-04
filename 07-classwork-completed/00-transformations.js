(function() {

  // Read in files
  d3.queue()
    .defer(d3.csv, "all-temps.csv")
    .await(ready);

  function ready(error, datapoints) {
    console.log("Datapoints are", datapoints)

    // Take every datapoint
    // And then extract its 'high' column
    // and store it in a new variable
    // throw a plus in there to convert to a number
    var highs = datapoints.map(function(d) {
      return +d.high
    })
    console.log("High temperatures are", highs)

    var maxHigh = d3.max(highs)
    var medianHigh = d3.median(highs)
    var meanHigh = d3.mean(highs)

    console.log("max high temp", maxHigh)
    console.log("median high temp", medianHigh)
    console.log("mean high temp", meanHigh)

    // hey d3, give me the minimum d.low
    // from all of these datapoints
    var minLow = d3.min(datapoints, function(d) { return +d.low })

    console.log("lowest low is", minLow)

    // Sort based on high temperature
    // if a - b, then lowest numbers first
    // if b - a, then highest numbers first
    datapoints.sort(function(a, b) {
      return a.high - b.high
    })

    console.log(datapoints)

    // the first one
    console.log("First element is", datapoints[0])

    // the last one
    console.log("Last element is", datapoints[datapoints.length-1])

    var filtered = datapoints.filter(function(d) {
      return d.city === "NYC"
    })

    console.log("NYC data points is", filtered)
  }



})();



