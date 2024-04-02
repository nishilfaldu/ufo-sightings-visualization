const colorScaleForShapes = ["#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#CCFF00","#99FF00","#66FF00","#33FF00","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#00CCFF","#0099FF","#0066FF","#0033FF","#0000FF","#3300FF","#6600FF","#9900FF","#CC00FF","#FF00FF","#FF00CC","#FF0099","#FF0066","#FF0033"];

class Barchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, 
    _dataStore
      ) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        colorScale: _config.colorScale,
        containerWidth: _config.containerWidth || 650,
        containerHeight: _config.containerHeight || 250,
        margin: _config.margin || {top: 25, right: 20, bottom: 50, left: 100},
      }
      this.data = _data;
      this.colorScale = colorScaleForShapes; 
      this.dataStore = _dataStore; 
      this.dataStore.subscribe(this); 

      this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff')
      .text('a simple tooltip');
      
      this.initVis(); 
    }
    
    /**
     * Initialize scales/axes and append static elements, such as axis titles
     */
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      // Initialize scales and axes
      vis.uniqueShapes = [...new Set(vis.data.map(d => d.ufo_shape))]
      // Initialize scales
      vis.colorScale = d3.scaleOrdinal()
          .range(vis.colorScale) 
          .domain(vis.uniqueShapes);
      
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]) 
  
      vis.xScale = d3.scaleBand()
          .range([0, vis.width])
          .paddingInner(0.2);
  
      vis.xAxis = d3.axisBottom(vis.xScale)

      vis.yAxis = d3.axisLeft(vis.yScale)
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // SVG Group containing the actual chart; D3 margin convention
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('transform', `translate(0,${vis.height})`)
      
      // Append y-axis group 
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis')
  
      // Append axis title
      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', '.71em')
          // .text('Number of UFO Sightings by Shape');

          vis.updateVis(); 
        
    }
  
    /**
     * Prepare data and scales before we render it
     */
    updateVis() {
      let vis = this;
  
      const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.ufo_shape);
      vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

  
      // Specificy accessor functions

      vis.colorValue = d => d.key;
      vis.xValue = d => d.key;
      vis.yValue = d => d.count;
  
      // Set the scale input domains
      vis.xScale.domain(vis.uniqueShapes);
      vis.yScale.domain([0, d3.max(vis.aggregatedData, d => d.count)]);
  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
  
      // Add rectangles
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, vis.xValue)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('fill', d => vis.colorScale(vis.colorValue(d)))
          .on("mouseover", function (event, d) {

            vis.tooltip.style("visibility", "visible")
              .html(
                "<strong>UFO Shape: </strong>" +
                  d.key +
                  "<br>" +
                  "<strong>Number of UFO Sightings: </strong>" +
                  d.count
              )
              .style("top", event.pageY - 10 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", function() {      
            vis.tooltip.style("visibility", "hidden");
          })
      
    
  
      // Update axes
      vis.xAxisG.call(vis.xAxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      vis.yAxisG.call(vis.yAxis)
  
    }

    update(data) {
      let vis = this;
      vis.data = data;
      vis.updateVis();
    }
    
  }