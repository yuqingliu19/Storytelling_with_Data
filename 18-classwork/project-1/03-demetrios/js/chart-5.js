(function() {

  var margin = { top: 50, left: 50, right: 50, bottom: 0};
  var height = 600 - margin.top - margin.bottom;

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  var svg_width = window.innerWidth;
  var width = svg_width/1.4 - margin.left - margin.right;
  
  var svg = d3.select("#chart-5")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(0,0)")

var continentScale = d3.scaleBand()
  .range([(width-100)/6, (width-100)])

console.log('kk', (width-100)/6, (width-100))

var simulation  = d3.forceSimulation()
  .force('x', d3.forceX(0).strength(0.001))
  .force('y', d3.forceY(0).strength(0.001))
  .force('collide', d3.forceCollide(function(d){
    return radiusScale(+d.kills_per_pop)
  }))


var colorScale = d3.scaleOrdinal()
      .range(['#450303', '#6e0505', '#951f1f', '#d09b9b', '#ad5151', '#e7cdcd'])
//    .range(['#311100', '#823300', '#E73400', '#FA952C', '#FFD26F', '#FFECB3'])
//  .range(['#45171D','#F03861','#FF847C','#E85285','#fed9a6',])
var radiusScale = d3.scaleSqrt()
  .range([0,80])

d3.queue()
  .defer(d3.csv, "csv/04_GTD-2013-2016_v04-AllCountries-Populations.csv")
  .await(ready)

  function ready(error, datapoints){
    console.log(datapoints)
    var fatalitiesMax = d3.max(datapoints, function(d){
      return +d.nkill
    })
    console.log('1', fatalitiesMax)

    var woundedMax = d3.max(datapoints, function(d){
      return +d.nwound
    })
    console.log('2', woundedMax)

    var casualtiesMax = fatalitiesMax + woundedMax

    var regions = d3.map(datapoints, function(d){
      return d.regions
    }).keys().sort()
    console.log(regions)

    var killsPerPopMax = d3.max(datapoints, function(d){
      return +d.kills_per_pop
    })



    continentScale
      .domain(regions)

    radiusScale
      .domain([0, killsPerPopMax])

    colorScale
      .domain(regions)

    circles5 = svg.selectAll(".circle-5")
      .data(datapoints)
      .enter().append("circle")
      .attr('class', 'circle-5')
      .attr('r', function(d){
        //var casualties = +d.nkill + +d.nwound
        return radiusScale(+d.kills_per_pop)
      })
      .attr('cx', function(d){
        return continentScale(d.regions)
      })
      .attr('cy', height/2)
      .attr('fill', function(d){
        return colorScale(d.regions)
      })
      .attr('stroke', 'lightgray')
      .attr('class', function(d){
        var casualties = +d.nkill + +d.nwound
        if (radiusScale(casualties) < 30) {
          return 'circle-total-small-5'
        } else if (radiusScale(casualties) < 80) {
          return 'circle-total-medium-5'
        } else {
          return 'circle-total-big-5'
        }
      })

      d3.selectAll('.circle-total-medium-5')
      .lower()
      d3.selectAll('.circle-total-big-5')
        .lower()
      d3.selectAll('.circle-total-small-5')
        .raise()


    simulation.nodes(datapoints)
      .on('tick', ticked5)

    datapoints.forEach(function(d){
      d.x = continentScale(d.regions)
      d.y = height/2
    })

    function ticked5() {
      circles5
        .attr("cx", function(d){
          return d.x
        })
        .attr("cy", function(d){
          return d.y
        })
    }


    var title = svg.append("text")
      .attr("class", 'text-title')
      .text('Africa, Middle East and Asia Are Terrorism\'s Battleground')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', 35)
      .attr('font-size', '23px')
      .attr('text-anchor', 'middle')

    var legendScale1 = d3.scaleBand()
      .domain(regions.slice(0,3))
      .range([50, width/1.5])

    var legend_circles = svg.selectAll(".legend-circles")
      .data(regions.slice(0,3))
      .enter().append("circle")
      .attr("class", "legend-circles")
      .attr('r', 10)
      .attr('fill', function(d){
        return colorScale(d)
      })
      .attr('cx', function(d){
        return width/4 + legendScale1(d) - 50
      })
      .attr('cy', height + margin.top + margin.bottom - 110)

    var legend_texts = svg.selectAll(".legend-texts")
      .data(regions.slice(0,3))
      .enter().append("text")
      .attr("class", "legend-texts")
      .attr('x', function(d){
        return width/4 + legendScale1(d) - 30
      })
      .attr('y', height + margin.top + margin.bottom - 103) 
      .text(function(d){
        return d.replace("\[\'", "").replace("\'\]", "")
      })

    var legendScale2 = d3.scaleBand()
      .domain(regions.slice(3,6))
      .range([50, width/1.3])

    var legend_circles_2 = svg.selectAll(".legend-circles-2")
      .data(regions.slice(3,6))
      .enter().append("circle")
      .attr("class", "legend-circles-2")
      .attr('r', 10)
      .attr('fill', function(d){
        return colorScale(d)
      })
      .attr('cx', function(d){
        return width/4 + legendScale2(d) - 50
      })
      .attr('cy', height + margin.top + margin.bottom - 85)

    var legend_texts_2 = svg.selectAll(".legend-texts-2")
      .data(regions.slice(3,6))
      .enter().append("text")
      .attr("class", "legend-texts")
      .attr('x', function(d){
        return width/4 + legendScale2(d) - 30
      })
      .attr('y', height + margin.top + margin.bottom - 78) 
      .text(function(d){
        return d.replace("\[\'", "").replace("\'\]", "")
      })


    var source = svg.append("text")
      .attr("class", 'text-source')
      .text('Total Fatalities and Wounded per 100,000 residents per Country for 2013-2016.')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', height + margin.top + margin.bottom - 35)
      .attr('font-size', '14px')
      .attr("text-anchor", 'middle')

    var source = svg.append("text")
      .attr("class", 'text-source')
      .text('Source: Global Terrorism Database - University of Maryland. Populations 2016 Estimates from World Bank')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', height + margin.top + margin.bottom - 15)
      .attr('font-size', '14px')
      .attr("text-anchor", 'middle')


  }
})();