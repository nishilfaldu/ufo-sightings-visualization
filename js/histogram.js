// const thresholds = [
//     0, 1e6, 2e6, 3e6, // denser at the start
//     5e6, 7e6, 10e6, 15e6, 20e6, 30e6, 40e6, 50e6, 60e6, 70e6, 80e6, 90e6, 100e6 // sparser towards the end
//   ];

class Histogram {
    constructor(opts) {
      this.data = opts.data;
      this.element = opts.element;
      this.margin = {top: 20, right: 40, bottom: 40, left: 50};
      this.width = 500 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.init();
    }
  
    init() {

        
   
      // Create SVG element
      this.svg = d3.select(this.element)
        .append('svg')
          .attr('width', this.width + this.margin.left + this.margin.right)
          .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
          .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  
      // Create scales
      this.xScale = d3.scaleLinear()
          .range([0, this.width])
          .domain([0, d3.max(this.data)]);
  
      this.yScale = d3.scaleLinear()
          .range([this.height, 0])
          .domain([0, (this.data).length]);
  
      // Create axes
      this.xAxis = this.svg.append("g")
        .attr("transform", `translate(0, ${this.height})`)
        .call(d3.axisBottom(this.xScale));
  
      this.yAxis = this.svg.append("g")
        .call(d3.axisLeft(this.yScale));
  
      // Draw histogram
      this.update();
    }
  
    update() {
        // Calculate custom thresholds programmatically
        let thresholds = [];
        let maxValue = d3.max(this.data);
        let binStep = maxValue / 100; // Start with a small bin width
        for (let i = 0; i <= maxValue; i += binStep) {
          thresholds.push(i);
          if (i > 1e6) { // Increase bin width beyond a certain threshold
            binStep *= 2; // Double the step size for larger values
          }
        }
      
        // Bin the data with programmatically calculated thresholds
        const histogram = d3.histogram()
          .value(d => d)
          .domain(this.xScale.domain())
          .thresholds(thresholds);
      
        const bins = histogram(this.data);
      
        // Update yScale domain based on the bin count
        this.yScale.domain([0, d3.max(bins, d => d.length)]);
      
        // Update the yAxis with the new scale
        this.yAxis.call(d3.axisLeft(this.yScale));
      
        // Format the ticks on the X-axis to display large numbers in a readable format
        this.xAxis.call(d3.axisBottom(this.xScale).tickFormat(d3.format(".2s")));
      
        // Bind bins data to the bars (rectangles)
        this.svg.selectAll(".bar")
          .data(bins)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", 1)
          .attr("transform", d => `translate(${this.xScale(d.x0)},${this.yScale(d.length)})`)
          .attr("width", d => Math.max(0, this.xScale(d.x1) - this.xScale(d.x0) - 1))
          .attr("height", d => this.height - this.yScale(d.length))
          .style("fill", "#69b3a2");
      }
  }
  