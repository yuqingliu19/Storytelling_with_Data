(function() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var canvas = d3.select("#chart-0")
        .append("canvas")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)

  var context = canvas.node().getContext("2d")

  d3.queue()
    .await(ready)

  // Reference at https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

  function ready(error) {
    // arc(x, y, radius, startAngle, endAngle, counterclockwise)

    // context.fillStyle = "pink"
    // moveTo(x, y)
    // lineTo(y, y)


    // fillRect(x, y, width, height)
  };

})();
