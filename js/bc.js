class BC {
    constructor(opts) {
      const { 
        data, 
        element, 
        width = 650, 
        height = 250, 
        margin = { top: 20, right: 20, bottom: 60, left: 100 },
        binSize = 20 
      } = opts;
  
      this.data = data.map(d => +d.encounter_length);
      this.element = element;
      this.width = width - margin.left - margin.right;
      this.height = height - margin.top - margin.bottom;
      this.margin = margin;
      this.binSize = binSize;
      this.binnedData = [];
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
      

      this.init();
    }
  
    binData() {
        let bins = {};
        this.data.forEach(length => {
          let bin = Math.floor(length / this.binSize) * this.binSize;
          bins[bin] = (bins[bin] || 0) + 1;
        });
      
        // Filter out the bins with no data
        this.binnedData = Object.keys(bins).reduce((result, bin) => {
          if (bins[bin] > 0) {
            result.push({
              label: bin / 1000, // Convert to 'thousands' for the label
              value: bins[bin],
              color: this.colorScale(result.length) // Assign a color from the color scale
            });
          }
          return result;
        }, []);
      
        this.binnedData.sort((a, b) => parseInt(a.label) - parseInt(b.label));
      }
      

    init() {
      this.binData();
  
      // SVG setup
      this.svg = d3.select(this.element)
        .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


// Define scales
this.xScale = d3.scaleBand()
    .rangeRound([0, this.width])
    .padding(0.1)
    .domain(this.binnedData.map(d => d.label));

this.yScale = d3.scaleLog()
    .range([this.height, 0])
    .domain([1, Math.ceil(d3.max(this.binnedData, d => d.value))])
    .clamp(true);

// Append g element for x axis and call x axis
this.xAxis = this.svg.append('g')
    .attr('transform', `translate(0,${this.height})`)
    .call(d3.axisBottom(this.xScale));

this.xAxis.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

// Append g element for y axis and call y axis
this.yAxis = this.svg.append('g')
    .call(d3.axisLeft(this.yScale).tickFormat(d3.format("~s"))); // Correct placement of yAxis call

  
      // X-axis title
      this.svg.append("text")
        .attr("transform", `translate(${this.width / 2}, ${this.height + this.margin.top + 20})`)
        .style("text-anchor", "middle")
        .text("Encounter Length (in thousands)");
  
      // Y-axis title
      this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin.left)
        .attr("x", 0 - (this.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency (in thousands)");
  
        this.svg.selectAll('.bar')
    .data(this.binnedData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => this.xScale(d.label))
    .attr('y', d => this.yScale(d.value))
    .attr('width', this.xScale.bandwidth())
    .attr('height', d => this.height - this.yScale(d.value))
    .attr('fill', (d, i) => this.colorScale(i)) 
    .on('mouseover', (event, d) => {
      this.tooltip
        .text(`Encounter Length (in thousands): ${d.label}, Frequency (in thousands): ${d.value}`)
        .style('visibility', 'visible');
    })
    .on('mousemove', event => {
      this.tooltip
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', () => {
      this.tooltip.style('visibility', 'hidden');
    });

    }
  
  
    update(newData) {
        // Update the data
        this.data = newData;
        this.binData();
    
        // Redraw the bars
        const bars = this.svg.selectAll('.bar')
          .data(this.binnedData);
    
        bars.exit().remove();
    
        // Enter + Update phase
        bars.enter().append('rect')
          .attr('class', 'bar')
          // ... rest of the attribute settings
          .merge(bars)
          .transition() // Add a transition for smooth updating
          .duration(500)
          .attr('y', d => this.yScale(d.value))
          .attr('height', d => this.height - this.yScale(d.value))
          .attr('fill', d => d.color);
    
        this.xAxis.transition().duration(500).call(d3.axisBottom(this.xScale));
        this.yAxis.transition().duration(500).call(d3.axisLeft(this.yScale));

      }
  }
  