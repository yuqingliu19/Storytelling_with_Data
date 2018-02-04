(function() {

  var margin = { top: 50, left: 50, right: 50, bottom: 0};
  var height = 500 - margin.top - margin.bottom;

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  var svg_width = window.innerWidth;
  var width = svg_width/1.4 - margin.left - margin.right;
  
  var svg = d3.select("#chart-4")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(0,0)")


var simulation  = d3.forceSimulation()
  .force('x', d3.forceX(width/2).strength(0.001))
  .force('y', d3.forceY(height/3).strength(0.001))
  .force('collide', d3.forceCollide(function(d){
    return radiusScale(+d.kills_per_pop)+3
  }))


var colorScale = d3.scaleOrdinal()
      .range(['#344655', '#8C8F97', '#EF988D', '#ECD1D3', '#D7BCB1', '#FFECB3'])
//    .range(['#311100', '#823300', '#E73400', '#FA952C', '#FFD26F', '#FFECB3'])
//  .range(['#45171D','#F03861','#FF847C','#E85285','#fed9a6',])
var radiusScale = d3.scaleSqrt()
  .range([0,75])

d3.queue()
  .defer(d3.csv, "csv/04_GTD-2013-2016_v04-AllCountries-Populations.csv")
  .await(ready)

  function ready(error, datapoints){
    console.log(datapoints)
    var fatalitiesMax = d3.max(datapoints, function(d){
      return +d.nkill
    })
    console.log('fatalitiesMax', fatalitiesMax)

    var woundedMax = d3.max(datapoints, function(d){
      return +d.nwound
    })
    console.log('woundedMax', woundedMax)

    var casualtiesMax = fatalitiesMax + woundedMax

    var killsPerPopMax = d3.max(datapoints, function(d){
      return +d.kills_per_pop
    })
    console.log('killsPerPopMax', killsPerPopMax)

    radiusScale
      .domain([0, killsPerPopMax])


    circles = svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', function(d){
        //var casualties = +d.nkill + +d.nwound
        return radiusScale(+d.kills_per_pop)
      })
      .attr('cx', width/2)
      .attr('cy', height/2)
      .attr('fill', function(d){
        if (d.regions === 'Europe & Russia'){
          return '#d09b9b'
        } else {
          return '#8a0707'
        }
      })
      .attr('stroke', 'lightgray')
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

      d3.selectAll('.circle-total-medium')
      .lower()
      d3.selectAll('.circle-total-big')
        .lower()
      d3.selectAll('.circle-total-small')
        .raise()

    var nodeTexts = svg.selectAll("text")
      .data(datapoints)
      .enter().append("text")
      .attr("class", "node-texts")
      .text(function(d){
        if (radiusScale(+d.kills_per_pop) > 30) {
        return d.country_txt
      } else {
        return ''
      } 
      })
      .attr('font-size', function(d){
        var strLength = d.country_txt.length
        if ( strLength <= 4) {
          return 30
        } else if ( strLength > 8) {
          return 15
        } else if ( 4 > strLength < 8 ) {
          return 17
        }
      })
      .attr('fill', 'white')
      .attr('x', width/2)
      .attr('y', height/2)
      .attr('text-anchor', 'middle')

    simulation.nodes(datapoints)
      .on('tick', ticked)

    datapoints.forEach(function(d){
      d.x = width/2
      d.y = height/2
    })

    function ticked() {
      circles
        .attr("cx", function(d){
          return d.x
        })
        .attr("cy", function(d){
          return d.y
        })
      nodeTexts
        .attr('x', function(d){
          return d.x
        })
        .attr('y', function(d){
          return d.y + 6
        })
    }



    var title = svg.append("text")
      .attr("class", 'text-title')
      .text('Europeans Still a Fraction of Terrorism Victims')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', 35)
      .attr('font-size', '23px')
      .attr('text-anchor', 'middle')

    var source = svg.append("text")
      .attr("class", 'text-source')
      .text('Total Fatalities and Wounded per 100,000 residents per Country for 2013-2016.')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', height + margin.top + margin.bottom - 25)
      .attr('font-size', '14px')
      .attr("text-anchor", 'middle')
    var source2 = svg.append("text")
      .attr("class", 'text-source')
      .text('Source: Global Terrorism Database - University of Maryland. Populations 2016 Estimates from World Bank')
      .attr('width', 10)
      .attr('x', width/1.8)
      .attr('y', height + margin.top + margin.bottom - 5)
      .attr('font-size', '14px')
      .attr("text-anchor", 'middle')




    var legend = ['Europe', 'Rest of the World']
    var legendScale = d3.scaleBand()
      .domain(legend)
      .range([0, 180])

    var legend_circles = svg.selectAll(".legend-circles")
      .data(legend)
      .enter().append("circle")
      .attr("class", "legend-circles")
      .attr('r', 10)
      .attr('fill', function(d){
        console.log(d)
        if (d === 'Europe') {
          return '#d09b9b'
        } else {
          return '#8a0707'
        }
      })
      .attr('cx', function(d){
        return width/2 + legendScale(d) - 30
      })
      .attr('cy', height + margin.top + margin.bottom - 65)


    var legend_texts = svg.selectAll(".legend-texts")
      .data(legend)
      .enter().append("text")
      .attr("class", "legend-texts")
      .text(function(d){
        return d
      })
      .attr('x', function(d){
        return width/2 + legendScale(d) - 10
      })
      .attr('y', height + margin.top + margin.bottom - 58) 




  }
})();