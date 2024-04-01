const colorScaleForShapes = [
  "#FF0000",
  "#FF3300",
  "#FF6600",
  "#FF9900",
  "#FFCC00",
  "#FFFF00",
  "#CCFF00",
  "#99FF00",
  "#66FF00",
  "#33FF00",
  "#00FF00",
  "#00FF33",
  "#00FF66",
  "#00FF99",
  "#00FFCC",
  "#00FFFF",
  "#00CCFF",
  "#0099FF",
  "#0066FF",
  "#0033FF",
  "#0000FF",
  "#3300FF",
  "#6600FF",
  "#9900FF",
];

class TOD {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      colorScale: _config.colorScale,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 25, right: 20, bottom: 50, left: 50 },
    };
    this.data = _data;
    this.colorScale = colorScaleForShapes;

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "10px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "4px")
      .style("color", "#fff")
      .text("a simple tooltip");

    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.innerRadius = 90;
    vis.outerRadius = Math.min(vis.width, vis.height) / 2; // the outerRadius goes from the middle of the SVG area to the border

    // Initialize scales and axes
    vis.hours = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ];
    // Initialize scales
    vis.colorScale = d3.scaleOrdinal().range(vis.colorScale).domain(vis.hours);

    vis.yScale = d3
      .scaleRadial()
      .range([vis.innerRadius, vis.outerRadius])
      .domain([0, 14000]);

    (vis.xScale = d3.scaleBand().range([0, 2 * Math.PI])),
      align(0).domain(data.map(vis.hours));

    vis.xAxis = d3.axisBottom(vis.xScale);

    vis.yAxis = d3.axisLeft(vis.yScale);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.width / 2 + vis.config.margin.left},${
          vis.height / 2 + vis.config.margin.top
        })`
      );

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");

    // Append axis title
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", ".71em")
      .text("Number of UFO Sightings by Time of Day");

    this.updateVis();
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    const aggregatedDataMap = d3.rollups(
      vis.data,
      (v) => v.length,
      (d) => int(d.date_time.split(" ")[1].split(":")[0])
    );
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({
      key,
      count,
    }));

    // Specificy accessor functions

    vis.colorValue = (d) => d.key;
    vis.xValue = (d) => d.key;
    vis.yValue = (d) => d.count;

    // Set the scale input domains
    vis.xScale.domain(vis.hours);
    vis.yScale.domain([0, d3.max(vis.aggregatedData, (d) => d.count)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    // const bars = vis.chart
    //   .selectAll(".bar")
    //   .data(vis.aggregatedData, vis.xValue)
    //   .join("rect")
    //   .attr("class", "bar")
    //   .attr("x", (d) => vis.xScale(vis.xValue(d)))
    //   .attr("width", vis.xScale.bandwidth())
    //   .attr("height", (d) => vis.height - vis.yScale(vis.yValue(d)))
    //   .attr("y", (d) => vis.yScale(vis.yValue(d)))
    //   .attr("fill", (d) => vis.colorScale(vis.colorValue(d)))
    //   .on("mouseover", function (event, d) {
    //     vis.tooltip
    //       .style("visibility", "visible")
    //       .html(
    //         "<strong>UFO Shape: </strong>" +
    //           d.key +
    //           "<br>" +
    //           "<strong>Number of UFO Sightings: </strong>" +
    //           d.count
    //       )
    //       .style("top", event.pageY - 10 + "px")
    //       .style("left", event.pageX + 10 + "px");
    //   })
    //   .on("mouseout", function () {
    //     vis.tooltip.style("visibility", "hidden");
    //   });

    // Add the bars
    svg
      .append("g")
      .selectAll("path")
      .data(vis.aggregatedData, vis.xValue)
      .enter()
      .append("path")
      .attr("fill", "#69b3a2")
      .attr(
        "d",
        d3
          .arc() // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function (d) {
            return y(d.vis.aggregatedData);
          })
          .startAngle(function (d) {
            return x(d.vis.xValue);
          })
          .endAngle(function (d) {
            return x(d.vis.xValue) + x.bandwidth();
          })
          .padAngle(0.01)
          .padRadius(innerRadius)
      );

    // Add the labels
    svg
      .append("g")
      .selectAll("g")
      .data(vis.aggregatedData, vis.xValue)
      .enter()
      .append("g")
      .attr("text-anchor", function (d) {
        return (x(d.vis.xValue) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "end"
          : "start";
      })
      .attr("transform", function (d) {
        return (
          "rotate(" +
          (((x(d.vis.xValue) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ")" +
          "translate(" +
          (y(d["Value"]) + 10) +
          ",0)"
        );
      })
      .append("text")
      .text(function (d) {
        return d.vis.xValue;
      })
      .attr("transform", function (d) {
        return (x(d.vis.xValue) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "rotate(180)"
          : "rotate(0)";
      })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

    // Update axes
    vis.xAxisG
      .call(vis.xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    vis.yAxisG.call(vis.yAxis);
  }
}
