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

  var colorScale = d3.scaleOrdinal()
    .range(['#7fc97f','#beaed4','#fdc086','#386cb0','#f0027f','#bf5b17','#666666'])

  d3.queue()
    .defer(d3.csv, "countries.csv")
    .await(ready)

  function ready(error, countries) {
    console.log("Countries are...", countries)
    /* Create my data points */
    var datapoints = []

    // Loop through each country...
    countries.forEach(function(d) {
      // console.log("---------")
      // console.log(d)
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
      // console.log(points)

      // Add the new points to datapoints
      datapoints = datapoints.concat(points)
    })

    console.log("Datapoints are...", datapoints)
    /* Finished creating my data points */







    // Setting our x and y
    datapoints.forEach(function(d) {
      d.x = Math.random() * width
      d.y = Math.random() * height
      d.color = colorScale(d.continent)
    })

    // // Drawing on the canvas
    // datapoints.forEach(function(d) {
    //   // context.fillStyle = 'red'
    //   context.fillStyle = d.color
    //   context.fillRect(d.x, d.y, 4, 4)
    // })

    function draw() {
      context.clearRect(0, 0, width, height)

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
        var t = Math.min(1, elapsed / duration)
        t = ease(t)

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
      // Update your points and give them a source
      // and a target
      datapoints.forEach(function(d) {
        // Save your current location as the source
        d.sx = d.x
        d.sy = d.y
        // Save the new position as the target
        d.tx = Math.random() * width
        d.ty = Math.random() * height
      })

      // Now do the animation
      update()
    })

    d3.select("#organized").on('click', function() {
      // Update your source and target
      datapoints.forEach(function(d, i) {
        d.sx = d.x
        d.sy = d.y
        d.tx = i * 5 % width
        d.ty = Math.floor(i * 5 / width) * 5
      })

      // Now do the animation
      update()
    })

    d3.select("#bars").on('click', function() {
      d3.nest()
        .key(function(d) {
          return d.continent
        })
        .entries(datapoints)
        .forEach(function(d) {
          console.log(d)
          // What is the y offset for this continent?
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