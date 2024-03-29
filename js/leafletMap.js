
const colorSchemes = {
  'year': [
      {label: '< 1940', color: '#d8f3dc'},
      {label: '1940 - 1969', color: '#ffd166'},
      {label: '1970 - 1999', color: '#ef476f'},
      {label: '>= 2000', color: '#118ab2'}
  ],
  'month': [
      {label: 'January', color: '#33C3F0'}, {label: 'February', color: '#2E5EAA'}, 
      {label: 'March', color: '#A8DADC'}, {label: 'April', color: '#F4A261'},
      {label: 'May', color: '#E9C46A'}, {label: 'June', color: '#2A9D8F'},
      {label: 'July', color: '#F4A261'}, {label: 'August', color: '#E76F51'},
      {label: 'September', color: '#2A9D8F'}, {label: 'October', color: '#264653'},
      {label: 'November', color: '#1D3557'}, {label: 'December', color: '#457B9D'}
  ],
  'time-of day': [
      {label: 'Night', color: '#023047'}, {label: 'Morning', color: '#F4A261'},
      {label: 'Afternoon', color: '#2A9D8F'}, {label: 'Evening', color: '#33C3F0'}
  ],
  'ufo-shape': [
      {label: 'Cylinder', color: '#ffadad'}, {label: 'Light', color: '#ffd6a5'},
      {label: 'Circle', color: '#fdffb6'}, {label: 'Sphere', color: '#caffbf'},
      {label: 'Disk', color: '#9bf6ff'}, {label: 'Fireball', color: '#a0c4ff'},
      {label: 'Unknown', color: '#bdb2ff'}, {label: 'Oval', color: '#ffc6ff'},
      {label: 'Other', color: '#fffffc'}, {label: 'Cigar', color: '#ffaaaa'},
      {label: 'Rectangle', color: '#d0f4de'}, {label: 'Chevron', color: '#fde2e4'},
      {label: 'Triangle', color: '#fad2e1'}, {label: 'Formation', color: '#c5dedd'},
      {label: 'Delta', color: '#dbe7e4'}, {label: 'Changing', color: '#f0efeb'},
      {label: 'Egg', color: '#d6e2e9'}, {label: 'Diamond', color: '#bcd4e6'},
      {label: 'Flash', color: '#99c1de'}, {label: 'Teardrop', color: '#a2d2ff'},
      {label: 'Cone', color: '#8d99ae'}, {label: 'Cross', color: '#edf2f4'},
      {label: 'Pyramid', color: '#e29578'}, {label: 'Round', color: '#e85d04'},
      {label: 'Crescent', color: '#dc2f02'}, {label: 'Flare', color: '#e63946'},
      {label: 'Hexagon', color: '#f1faee'}, {label: 'Dome', color: '#a8dadc'},
      {label: 'Changed', color: '#457b9d'}
  ]
};


class LeafletMap {
  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    };
    this.data = _data;
    this.baseLayer = null;
    this.initVis();
  }


    /**
     * Class constructor with basic configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _shapeColors) {
      this.config = {
        parentElement: _config.parentElement,
      }
      this.data = _data;
      this.shapeColors = _shapeColors; 
      this.baseLayer = null;
      this.initVis();
    }
    
      /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    //Thunderforest Outdoors- requires key... so meh... 
    vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
    vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background

    // OLDER MAP LAYER
    // vis.base_layer = L.tileLayer(vis.esriUrl, {
    //   id: 'esri-image',
    //   attribution: vis.esriAttr,
    //   ext: 'png'
    // });

    // NEW MAP LAYER

    vis.base_layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
      minZoom: 1,
      maxZoom: 16,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'jpg'
    });

    // console.log(this.baseLayer, "in here")

    vis.theMap = L.map('my-map', {
      center: [30, 0],
      zoom: 2,
      layers: [vis.base_layer]
    });

    
    //if you stopped here, you would just have a map

    //initialize svg for d3 to add to map
    L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")

    //these are the city locations, displayed as a set of dots 
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", "steelblue") 
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "red") //change the fill
                              .attr('r', 4); //change radius

                            //create a tool tip
                            d3.select('#tooltip')
                              .style('opacity', 1)
                              .style('z-index', 1000000)
                              .html(`
                                City Area: ${d.city_area}<br>
                                Country: ${d.country}<br>
                                Date Documented: ${d.date_documented}<br>
                                Date Time: ${d.date_time}<br>
                                Described Encounter Length: ${d.described_encounter_length}<br>
                                Description: ${d.description}<br>
                                Encounter Length: ${d.encounter_length}<br>
                                Latitude: ${d.latitude}<br>
                                Longitude: ${d.longitude}<br>
                                State: ${d.state}<br>
                                UFO Shape: ${d.ufo_shape}
                              `);

                          })
                        .on('mousemove', (event) => {
                            //position the tooltip
                            d3.select('#tooltip')
                             .style('left', (event.pageX + 10) + 'px')   
                              .style('top', (event.pageY + 10) + 'px');
                         })              
                        .on('mouseleave', function() { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "steelblue") //change the fill
                              .attr('r', 3) //change radius

                            d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

                          })
                        .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
                           // vis.newZoom = vis.theMap.getZoom()+2;
                           // if( vis.newZoom > 18)
                           //  vis.newZoom = 18; 
                           // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
                          });
    
    //handler here for updating the map, as you zoom in and out           
    vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });
    vis.colorByPoints('year');
    vis.drawLegend('year');

  }

  

  colorByPoints(category) {
    let vis = this;

    function getColorForYear(year) {
      if (year < 1940) {
          return '#d8f3dc'; 
      } else if (year < 1970) {
          return '#ffd166'; 
      } else if (year < 2000) {
          return '#ef476f'; 
      } else {
          return '#118ab2';
      }
  }

    function getColor(d) {
        switch (category) {
            case 'year':
              const date = new Date(d.date_time);
              const year = date.getFullYear();
              return getColorForYear(year);

            case 'month':
                // Cooler colors for winter, warmer for spring, bright for summer, muted for fall
                const monthColors = ['#33C3F0', '#2E5EAA', '#A8DADC', '#F4A261', '#E9C46A', '#2A9D8F', '#F4A261', '#E76F51', '#2A9D8F', '#264653', '#1D3557', '#457B9D'];
                return monthColors[new Date(d.date_time).getMonth()];

            case 'time-of day':
                // Morning to evening gradient
                const hour = new Date(d.date_time).getHours();
                if (hour < 6) return '#023047'; // Night
                else if (hour < 12) return '#F4A261'; // Morning
                else if (hour < 18) return '#2A9D8F'; // Afternoon
                else return '#264653'; // Evening

                case 'ufo-shape':
                  // Use precomputed shapeColors
                  return vis.shapeColors[d.ufo_shape] || '#999999'; 
            default:
                return '#000000'; // Default color if no category matches
        }
    }

    // Update the dots' fill color based on the selected category
    vis.Dots.attr('fill', d => getColor(d));
    // After coloring, update the legend to match the new category
    vis.drawLegend(category);
}

drawLegend(category) {
  let vis = this;
  const colorScheme = colorSchemes[category];

  // Check if a legend control already exists and remove it
  if (vis.legendControl) {
    vis.theMap.removeControl(vis.legendControl);
  }

  // Create a new Leaflet control for the legend
  vis.legendControl = L.control({position: 'bottomright'}); // You can adjust position

  // Method to add the legend to the map
  vis.legendControl.onAdd = function (map) {
    // Create a div with a class "legend"
    var div = L.DomUtil.create('div', 'legend');
    div.style.padding = '6px 8px';
    div.style.background = 'white';
    div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    div.style.borderRadius = '5px';
    div.style.color = '#555';

    // Add a title to the legend
    let legendHtml = `<strong>Legend (${category})</strong><br/>`;

    // Iterate over the color scheme for the current category
    // And add color swatches to the legend
    colorScheme.forEach(function(item) {
      legendHtml += `
        <i style="background: ${item.color}; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i>
        <span>${item.label}</span><br/>`;
    });

    // Insert the HTML into the div
    div.innerHTML = legendHtml;
    return div;
  };

  // Add the legend control to the map
  vis.legendControl.addTo(vis.theMap);
}



  updateVis() {
    let vis = this;

    //want to see how zoomed in you are? 
    // console.log(vis.map.getZoom()); //how zoomed am I
    
    //want to control the size of the radius to be a certain number of meters? 
    vis.radiusSize = 3; 

    // if( vis.theMap.getZoom > 15 ){
    //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
    //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
    //   radiusSize = desiredMetersForPoint / metresPerPixel;
    // }
   
   //redraw based on new zoom- need to recalculate on-screen position
    vis.Dots
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("r", vis.radiusSize) ;

  }

  changeBaseLayer(newBaseLayer) {
    // Remove the current base layer
    this.theMap.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        console.log(layer, "layer");
          this.theMap.removeLayer(layer);
      }
  });
  // Add the new base layer
  this.baseLayer = newBaseLayer;
  // Add the new base layer to the map
  this.theMap.addLayer(this.baseLayer);
  }


  renderVis() {
    let vis = this;

    //not using right now... 
 
    }
  }
