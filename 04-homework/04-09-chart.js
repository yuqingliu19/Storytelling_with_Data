(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic



  // Build your scales here



  d3.queue()
    .defer(d3.csv, "eating-data.csv")
    .await(ready)


  function ready(error, datapoints) {
    // Add and style your marks here


  }
})()