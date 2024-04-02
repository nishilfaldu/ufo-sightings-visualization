const colorScaleForShapes_ = ['#023047', '#F4A261', '#2A9D8F', '#264653']

class TimeOfDayBarChart {
    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      console.log(_data, "data in tod");
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        colorScale: _config.colorScale,
        containerWidth: _config.containerWidth || 800,
        containerHeight: _config.containerHeight || 240,
        margin: _config.margin || {top: 25, right: 20, bottom: 50, left: 50},
      }
      this.data = _data;
      this.colorScale = colorScaleForShapes_;

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
      vis.uniqueTimes = ["Night", "Morning", "Afternoon", "Evening"]
      // Initialize scales
      vis.colorScale = d3.scaleOrdinal()
          .range(vis.colorScale) 
          .domain(vis.uniqueTimes);
      
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
          .text('Number of UFO Sightings by Time of Day');
        
      this.updateVis();
    }
  
    /**
     * Prepare data and scales before we render it
     */
    updateVis() {
      let vis = this;
      let aggregatedDataMap = [["Night", 0], ["Morning", 0], ["Afternoon", 0], ["Evening", 0]];
      vis.data.map(d => {
        const hour  = new Date(d.date_time).getHours();
        if (hour >= 0 && hour < 6) {
          aggregatedDataMap[0][1] += 1;
        } else if (hour >= 6 && hour < 12) {
          aggregatedDataMap[1][1] += 1;
        } else if (hour >= 12 && hour < 18) {
          aggregatedDataMap[2][1] += 1;
        } else {
          aggregatedDataMap[3][1] += 1;
        }
      
      })
      console.log(aggregatedDataMap);
      vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

  
      // Specificy accessor functions

      vis.colorValue = d => d.key;
      vis.xValue = d => d.key;
      vis.yValue = d => d.count;
  
      // // Set the scale input domains
      vis.xScale.domain(vis.uniqueTimes);
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
                "<strong>UFO Sighting (Time of Day): </strong>" +
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
  }