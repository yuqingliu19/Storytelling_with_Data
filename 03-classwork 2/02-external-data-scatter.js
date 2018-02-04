/*********
*
* D3 example #02:
* Using the margin convention
* Circles
* Dynamic SVG insertion
* Reading in external data
* selectAll/append/etc
*
*********/

(function () {

  /*
   
   WE WILL USE THIS CODE LATER, LEAVE IT COMMENTED OUT FOR NOW

  */

  // // Always cut and paste this code to get a height and width
  // // with some nice padding around the edges
  // var margin = { top: 100, left: 50, right: 50, bottom: 50},
  //     height = 800 - margin.top - margin.bottom,
  //     width = 800 - margin.left - margin.right;
  // 
  // // Grab the SVG from the page, set the height and width
  // var svg = d3.select("#chart")
  //     .append("svg")
  //     .attr("height", height + margin.top + margin.bottom)
  //     .attr("width", width + margin.left + margin.right)
  //     .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Select the svg



  // Read in some external data. When we're done, run the function 'ready'



  // This is 'ready':
  // it receives an error (if there is one)
  // and datapoints, our newly-read-in data

  function ready(error, datapoints) {

    // d3 code goes here


    // Always cut and paste the code for the axes, too!

    // var yAxis = d3.axisLeft(yPositionScale);
    // svg.append("g")
    //   .attr("class", "axis y-axis")
    //   .call(yAxis);

    // var xAxis = d3.axisBottom(xPositionScale)
    // svg.append("g")
    //   .attr("class", "axis x-axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis);

  }

})();
