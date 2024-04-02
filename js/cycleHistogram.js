class CycleHistogram{
    constructor(_config, _data) {
        this.config = {
          parentElement: _config.parentElement,
          width: 650,
          height: 250,
          margin: { top: 10, right: 50, bottom: 100, left: 100 },
        };
        this.data = _data;
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.seasonNames = ["Spring", "Summer", "Fall", "Winter"];

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

        d3.selectAll("#annual-cycle-dropdown").on("change", (event) => this.updateVis());
        this.initVis();
      }

      initVis(){
        let vis = this;

        const containerWidth =
            vis.config.width + vis.config.margin.left + vis.config.margin.right;
        const containerHeight =
            vis.config.height + vis.config.margin.top + vis.config.margin.bottom;

        vis.xScale = d3.scaleBand().range([0, vis.config.width]).padding(0.2);

        vis.yScale = d3.scaleLinear().range([vis.config.height, 0]);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .attr('margin-bottom', vis.config.margin.bottom);
    
        // SVG Group containing the actual chart; D3 margin convention
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.xAxisG = vis.chart.append('g')
            .attr('transform', `translate(0,${vis.config.height})`);
        
        // Append y-axis group 
        vis.yAxis = d3.axisLeft(vis.yScale);
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');


        vis.updateVis();
      }

      updateVis(){
        let vis = this;

        vis.binSelect = d3.selectAll("#annual-cycle-dropdown")._groups[0][0].value;

        vis.binnedData = [];

        switch(this.binSelect){
            case 'month':
                vis.xAxis.tickFormat((d, i) => vis.monthNames[i]);
                vis.xScale.domain(vis.BuildAscendingArray(12));
                vis.binnedData = Array.apply(null, Array(12)).map(() => 0);
                for(let i = 0; i < vis.data.length; i++){
                    vis.binnedData[vis.data[i].date.getMonth()] += vis.data[i].close;
                }
                break;
            case 'day':
                vis.xAxis.tickFormat((d, i) => vis.weekDayNames[i]);
                vis.xScale.domain(vis.BuildAscendingArray(7));
                vis.binnedData = Array.apply(null, Array(7)).map(() => 0);
                for(let i = 0; i < vis.data.length; i++){
                    vis.binnedData[vis.data[i].date.getDay()] += vis.data[i].close;
                }
                break;
            case 'season':
                vis.xAxis.tickFormat((d, i) => vis.seasonNames[i]);
                vis.xScale.domain(vis.BuildAscendingArray(4));
                vis.binnedData = Array.apply(null, Array(4)).map(() => 0);
                for(let i = 0; i < vis.data.length; i++){
                    vis.binnedData[vis.GetSeason(vis.data[i].date)] += vis.data[i].close;
                }
                break;
            default:
                break;
        }

        vis.yScale.domain([0, d3.max(vis.binnedData)]);

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
        
        vis.renderVis();
      }

      renderVis(){
        let vis = this;

        vis.bars = vis.chart.selectAll("rect")
            .data(vis.binnedData)
            .join("rect")
                .attr("x", (d, i) => vis.xScale(i))
                .attr("y", (d, i) => vis.yScale(d))
                .attr("width", vis.xScale.bandwidth())
                .attr("height", (d, i) => vis.config.height - vis.yScale(d))
                .attr("fill", "#69b3a2")
                .on('mouseover', function(event, d){
                    vis.tooltip.style("visibility", "visible")
                    .html(
                        "<strong>Number of UFO Sightings: </strong>" +
                        d
                    )
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
                })
                .on('mousemove', function(event, d){
                    vis.tooltip
                        .style("top", event.pageY - 10 + "px")
                        .style("left", event.pageX + 10 + "px");
                })
                .on('mouseout', function(event){
                    vis.tooltip.style("visibility", "hidden");
                });
      }

      GetSeason(date){
        let month = date.getMonth();
        let springMonths = [2, 3, 4];
        let summerMonths = [5, 6, 7];
        let fallMonths = [8, 9, 10];
        let winterMonths = [11, 1, 2];
        if (springMonths.includes(month))
            return 0;
        else if (summerMonths.includes(month))
            return 1;
        else if (fallMonths.includes(month))
            return 2;
        else if (winterMonths.includes(month))
            return 3;
        else
            return -1;
      }

      BuildAscendingArray(n){
        let array = []
        for(let i = 0; i < n; i++)
            array.push(i);
        return array;
      }
}