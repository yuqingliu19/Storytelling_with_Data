(function() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 700 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var canvas = d3.select("#chart-3")
        .append("canvas")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)

  var context = canvas.node().getContext("2d")

  d3.queue()
    .await(ready)

  function ready(error) {
    var duration = 2500
    var ease = d3.easeCubic
    var source = 0, target = width

    var points = [
      { x: 0, y: 20 },
      { x: 0, y: 70 },
      { x: 0, y: 120 },
      { x: 0, y: 170 },
    ]
    
    function draw() {
      // Clear the screen
      context.clearRect(0, 0, width, height)

      // Draw each point
      points.forEach(function(d) {
        context.beginPath()
        context.arc(d.x, d.y, 10, Math.PI * 2, 0)
        context.fill()
        context.closePath()
      })
    }

    function update(elapsed) {
      // How far through the animation are we?
      // var t = Math.min(1, ease(elapsed / duration))

      // Interpolate between 'source' and 'target'
      // current = source * (1 - t) + target * t
      // we need to do this for d.x

      // Redraw
      draw()

      // If done, stop or go back the other way

    }

    d3.select("#ease-start").on('click', function() {
      // Set a timer to update as often as possible
    })

    d3.select("#ease-stop").on('click', function() {
      timer.stop()
    })

    draw()
  }
})();
