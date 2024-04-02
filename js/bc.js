class BC {
    constructor(opts) {
      const { 
        data, 
        element, 
        width = 650, 
        height = 250, 
        margin = { top: 20, right: 20, bottom: 60, left: 100 },
        binSize = 20,
       dataStore, 
      } = opts;
  
      this.data = data.map(d => +d.encounter_length);
      this.element = element;
      this.width = width - margin.left - margin.right;
      this.height = height - margin.top - margin.bottom;
      this.margin = margin;
      this.binSize = binSize;
      this.binnedData = [];
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      this.dataStore = dataStore; 
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
      

      this.init();
    }
  
    // binData() {
    //     let bins = {};
    //     this.data.forEach(length => {
    //       let bin = Math.floor(length / this.binSize) * this.binSize;
    //       bins[bin] = (bins[bin] || 0) + 1;
    //     });
      
    //     // Filter out the bins with no data
    //     this.binnedData = Object.keys(bins).reduce((result, bin) => {
    //       if (bins[bin] > 0) {
    //         result.push({
    //           label: bin / 1000, // Convert to 'thousands' for the label
    //           value: bins[bin],
    //           color: this.colorScale(result.length) // Assign a color from the color scale
    //         });
    //       }
    //       return result;
    //     }, []);
      
    //     this.binnedData.sort((a, b) => parseInt(a.label) - parseInt(b.label));
    //   }
    binData() {
      // Adjust bin size dynamically based on data range to avoid cramped bars
      const dataRange = d3.extent(this.data);
      const dataSpan = dataRange[1] - dataRange[0];
      this.binSize = Math.ceil(dataSpan / 20); // Adjust the 20 based on desired granularity
      
      let bins = {};
      this.data.forEach(length => {
        let bin = Math.floor(length / this.binSize) * this.binSize;
        bins[bin] = (bins[bin] || 0) + 1;
      });
    
      this.binnedData = Object.keys(bins).reduce((result, bin) => {
        if (bins[bin] > 0) {
          result.push({
            label: bin / 1000,
            value: bins[bin],
            color: this.colorScale(result.length)
          });
        }
        return result;
      }, []);
    
      this.binnedData.sort((a, b) => parseInt(a.label) - parseInt(b.label));
  }


init() {

  this.svg = d3.select(this.element)
    .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .append('g')
    .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

  // Define scales - Keep scales definition here if they don't need to be recalculated with new data
  this.xScale = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);

  this.yScale = d3.scaleLog()
      .range([this.height, 0])
      .clamp(true);

  // Append g element for x axis - Static part
  this.xAxis = this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`);

  // Append g element for y axis - Static part
  this.yAxis = this.svg.append('g');

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

  // Call update function to create the dynamic parts
  this.updateVis(); // Assuming this prepares your data
}

updateVis() {
//    this.binData(); 
//   // Update domains
//   this.xScale.domain(this.binnedData.map(d => d.label));
//   this.yScale.domain([1, Math.ceil(d3.max(this.binnedData, d => d.value))]);

//   const labelAngle = this.binnedData.length > 10 ? -65 : -45; // Adjust angle based on the number of bins
//   this.xAxis.call(d3.axisBottom(this.xScale))
//     .selectAll("text")
//     .style("text-anchor", "end")
//     .attr("dx", "-.8em")
//     .attr("dy", ".15em")
//     .attr("transform", `rotate(${labelAngle})`);

//  this.yAxis.call(d3.axisLeft(this.yScale).ticks(4).tickFormat(d3.format("~s")));
this.binData();
   // Update domains
   this.xScale.domain(this.binnedData.map(d => d.label));
   this.yScale.domain([1, Math.ceil(d3.max(this.binnedData, d => d.value))]);

   const labelAngle = this.binnedData.length > 10 ? -65 : -45;
   this.xAxis.call(d3.axisBottom(this.xScale))
     .selectAll("text")
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("transform", `rotate(${labelAngle})`);

   // Manually define tick values for the y-axis
   const yDomainMax = Math.ceil(d3.max(this.binnedData, d => d.value));
   let tickValues;
   if (yDomainMax <= 10) {
       // For smaller ranges, use linear tick values
       tickValues = d3.range(1, yDomainMax + 1, 1);
   } else {
       // For larger ranges, use logarithmic tick values
       tickValues = [1, 10, 100, 1000, 10000].filter(d => d <= yDomainMax);
       // Add the maximum domain value if it's not already included
       if (!tickValues.includes(yDomainMax)) {
           tickValues.push(yDomainMax);
       }
   }

   this.yAxis.call(d3.axisLeft(this.yScale)
     .tickValues(tickValues)
     .tickFormat(d3.format("~s")));

  // Bind data to bars and update
  const bars = this.svg.selectAll('.bar')
    .data(this.binnedData);

  bars.enter().append('rect')
    .attr('class', 'bar')
    .merge(bars) // Combine enter and update selections
    .attr('x', d => this.xScale(d.label))
    .attr('y', d => this.yScale(d.value))
    .attr('width', this.xScale.bandwidth())
    .attr('height', d => this.height - this.yScale(d.value))
    .attr('fill', (d, i) => this.colorScale(i));

  // Update events for new and updated bars
  bars.on('mouseover', (event, d) => {
      this.tooltip
        .html(`<strong>Encounter Length (in thousands): </strong>${d.label}<br><strong>Frequency (in thousands): </strong>${d.value}`)
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

  // Remove exit selection
  bars.exit().remove();
}

    update(data)
    {
      let vis = this; 
      vis.data = data.map(d => +d.encounter_length).filter(length => !isNaN(length));

      vis.updateVis(); 
    }
}