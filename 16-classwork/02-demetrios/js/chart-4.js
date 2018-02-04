(function() {

  var margin = { top: 50, left: 50, right: 50, bottom: 50};
  var height = 700 - margin.top - margin.bottom;

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  var svg_width = window.innerWidth;
  var width = svg_width/1.3 - margin.left - margin.right;
  
  var svg = d3.select("#chart-3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(0,0)")

var forceX = d3.forceX(width/2)
  .strength(0.002) // strength is between 0 and 1
var forceY = d3.forceY(height/2)
  .strength(0.002)
var forceCollide = d3.forceCollide(function(d){
        return radiusScale(d.nkill)+8
      })

var simulation = d3.forceSimulation()
    .velocityDecay(0.4)
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", forceCollide)

var radiusScale = d3.scaleSqrt()
  .range([0,150])

var colorScale = d3.scaleOrdinal()
      .range(['#344655', '#8C8F97', '#EF988D', '#ECD1D3', '#D7BCB1', '#FFECB3'])
//    .range(['#311100', '#823300', '#E73400', '#FA952C', '#FFD26F', '#FFECB3'])
//  .range(['#45171D','#F03861','#FF847C','#E85285','#fed9a6',])


var legendScale = d3.scaleBand()
  .range([0, 150])


d3.queue()
  .defer(d3.csv, "03_GTD-2016_Sums-per-country_v01.csv")
  .await(ready)

  function ready(error, datapoints){
    console.log(datapoints)
    var fatalitiesMax = d3.max(datapoints, function(d){
      return +d.nkill
    })
    console.log(fatalitiesMax)

    var woundedMax = d3.max(datapoints, function(d){
      return +d.nwound
    })
    console.log(woundedMax)

    radiusScale
      .domain([0, fatalitiesMax+woundedMax])
    
    var title = svg.append("text")
      .attr("class", 'text-title')
      .text('Europeans Still a Fraction of Global Terrorism Victims')
      .attr('width', 10)
      .attr('x', width/4)
      .attr('y', 50)
      .attr('font-size', '23px')


    var getSize; 
    var el = document.getElementsByClassName('text-title'); 

    for(i=0; i<el.length; i++) { 

        getSize = el[i].getBBox(); 
        console.log(getSize); 
    } 

    title.attr('x', getSize.x)

    var regions = d3.map(datapoints, function(d){
      return d.regions
    }).keys()
    console.log(regions)

    legendScale
      .domain(regions)

    var legend_circles = svg.selectAll(".legend-circles")
      .data(regions)
      .enter().append("circle")
      .attr("class", "legend-circles")
      .attr('r', 10)
      .attr('fill', function(d){
        //console.log(d)
        return colorScale(d)
      })
      .attr('cx', 50)
      .attr('cy', function(d){
        console.log(legendScale(d))
        return height/2 + legendScale(d)
      })

    var legend_texts = svg.selectAll(".legend-texts")
      .data(regions)
      .enter().append("text")
      .attr("class", "legend-texts")
      .text(function(d){
        return d.replace("['","").replace("']","")
      })
      .attr('x', 70)
      .attr('y', function(d){
        console.log(legendScale(d))
        return height/2 + legendScale(d) + 6
      })

    var circles = svg.append("g")
      .attr("transform", "translate("+ width/2 + "," + height/1.6 +  ")")
      .selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr('class', function(d){
        var casualties = +d.nkill + +d.nwound
        if (radiusScale(casualties) < 30) {
          return 'circle-total-small'
        } else if (radiusScale(casualties) < 80) {
          return 'circle-total-medium'
        } else {
          return 'circle-total-big'
        }
      })
      .attr('r', function(d){
        var casualties = +d.nkill + +d.nwound
        return radiusScale(casualties)
      })
      .attr('fill', function(d){
        return colorScale(d.regions)
      })
      .attr('stroke', 'lightgray')
      .attr('cx', width/2)
      .attr('cy', height/2)





    d3.selectAll('.circle-total-medium')
      .lower()
    d3.selectAll('.circle-total-big')
      .lower()
    d3.selectAll('.circle-total-small')
      .raise()
    // d3.select("#fatalities")
    //   .on("click", function(d){
    //     console.log("hiiiii")
    //     var remove = svg.selectAll("circle")
    //       .attr('cx', 0)
    //       .attr('cy', 0)
    //     // var fatalities = svg.selectAll(".circle-fatalities")
    //     //   .enter().append("circle")
    //     //   .data(datapoints)
    //     //   .attr('r', function(d){
    //     //     return radiusScale(+d.nkill)
    //     //   })
    //     //   .attr('fill', function(d){
    //     //     return colorScale(d.regions)
    //     //   })
    //     //   .attr('cx', width/4)
    //     //   .attr('cy', height/2)
    //   })


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d){
          return d.x
        })
        .attr("cy", function(d){
          return d.y
        })
    }







  }
})();