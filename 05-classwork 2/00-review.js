(function () {

  // ~~~ NOTE ~~~
  // if you want to steal things for axes/etc
  // chart-5.js is a good source

  var height = 400, width = 700

  var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)

  // Read in some external data.
  // When we're done, run the function 'ready'


  // This is 'ready':
  // it receives an error (if there is one)
  // and datapoints, our newly-read-in data

  function ready(error, datapoints) {


  }

})()