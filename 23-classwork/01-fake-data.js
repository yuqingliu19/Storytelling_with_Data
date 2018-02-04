(function() {
  
  var width = 700,
      height = 500

  var canvas = d3.select("#chart-1")
        .append("canvas")
        .attr("height", height)
        .attr("width", width)

  var context = canvas.node().getContext("2d")

  var yPositionScale = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "Africa", "N. America", "S. America", "Oceania"])
    .range([0, 285, 335, 400, 440, 470])

  var colorScale = d3.scaleOrdinal().range(['#7fc97f','#beaed4','#fdc086','#386cb0','#f0027f','#bf5b17','#666666'])

  d3.queue()
    .defer(d3.csv, "countries.csv")
    .await(ready)

  function ready(error, countries) {
    console.log("Countries are...", countries)
    /* Create my data points */
    var datapoints = []

    // Loop through each country...
    countries.forEach(function(d) {
      // And create a bunch of points for that country
      // 1 point for every 500,000 people
      var pointCount = d.population / 500000

      // use d3.range to create a [0, 1, 2, 3, 4...] list
      // and just turn each one into something that
      // knows which country and continent it's from
      var points = d3.range(pointCount).map(function() {
        return {
          country: d.country,
          continent: d.continent
        }
      })

      // Add the new points to datapoints
      datapoints = datapoints.concat(points)
    })

    console.log("Datapoints are...", datapoints)
    /* Finished creating my data points */

    datapoints.forEach(function(d) {
      d.x = 0
      d.y = 0
      d.color = colorScale(d.continent)
    })

    function draw() {
      context.clearRect(0,0,width,height)
      datapoints.forEach(function(d) {  
        // Draw a 4x4 rectangle
        context.fillStyle = d.color
        context.fillRect(d.x, d.y, 4, 4)
      })
    }

    function update() {
      var duration = 1500
      var ease = d3.easeCubic

      var timer = d3.timer(function(elapsed) {
        var t = ease(elapsed / duration)

        datapoints.forEach(function(d) {
          d.x = d.sx * (1 - t) + d.tx * t
          d.y = d.sy * (1 - t) + d.ty * t
        })

        if(elapsed > duration) {
          timer.stop()
        }

        draw()
      })
    }

    d3.select("#random").on('click', function() {
      datapoints.forEach(function(d){
        d.sx = d.x
        d.sy = d.y

        d.tx = Math.random() * width
        d.ty = Math.random() * height
      })
    })

    var duration = 2000

    d3.select("#organized").on('click', function() {
      datapoints.forEach(function(d, i) {
        d.x = i * 5 % width
        d.y = Math.floor(i * 5 / width) * 5
      })
      draw()
    })

    d3.timer(function(elapsed){
      console.log(elapsed)
      if (elapsed > 5000){
        timer.stop()
      }
    })

    var duration = 2000

    var ease = d3.easeLinear

    var timer = d3.timer(function(elapsed){
      var t = Math.min(1, elapsed / duration)

      t = ease(t)

      console.log(t)
      
      datapoints.forEach(function(d){
        d.x = d.tx * (1 - t) + d.tx * t
        d.y = d.ty * (1 - t) + d.dy * t
      })

      if(t >= 1) {
        timer.stop()
      }

      datapoints.forEach(function(d){

      })

    })

    d3.select("#bars").on('click', function() {
      d3.nest()
        .key(function(d) {
          return d.continent
        })
        .entries(datapoints)
        .forEach(function(d) {
          console.log(d)
          var offset = yPositionScale(d.key)
          d.values.forEach(function(d, i) {
            d.sx = d.x
            d.sy = d.y
            d.tx = i * 5 % width
            d.ty = offset + Math.floor(i * 5 / width) * 5
          })
        })
      update()
    })

    draw()
  }
})()