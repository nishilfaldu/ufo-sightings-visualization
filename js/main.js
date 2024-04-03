import { CentralDataStore } from "./CentralDataStore.js";
const dataStore = new CentralDataStore(); 

var parseTime = d3.timeParse("%m/%d/%Y %H:%M");
var date_array = {};
let ufo_frequency = "date,close\n";
let encounterLengths = [];

const parseTime2 = d3.timeParse("%m/%d/%Y");

// functions/constants

function sortByDates(dates) {
  let keys = Object.keys(dates);
  // console.log("keys: ", keys);
  keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let r = [];
  for (let i = 0; i < keys.length; i++) {
    let object = new Object();
    object.date = keys[i];
    object.close = dates[keys[i]];
    r.push(object);
  }

  return r;
}

// Function to populate options for the second dropdown based on the selection in the first dropdown
function populateSecondDropdown(selectedOption, secondDropdownOptions) {
  const secondDropdown = document.getElementById("second-dropdown");
  secondDropdown.innerHTML = ""; // Clear existing options
  secondDropdownOptions[selectedOption].forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = option;
    secondDropdown.appendChild(optionElement);
  });
}


function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

let uniqueYears = new Array();
let uniqueShapes = new Array();

d3.csv("data/ufo_sightings.csv")
  .then((data) => {
    // console.log(data);
    // console.log(data.length);

    let notMappedCount = 0;
    const years = new Set();
    const shapes = new Set();
    const shapeColors = {}; // Object to hold UFO shape to color mapping

    // Define options for the second dropdown based on the selection in the first dropdown
    const secondDropdownOptions = {
      date_time: extractUniqueYears(data),
      city_area: [...new Set(data.map((d) => d.city_area))],
      state: [...new Set(data.map((d) => d.state))],
      country: [...new Set(data.map((d) => d.country))],
      ufo_shape: [...new Set(data.map((d) => d.ufo_shape))],
    };

    // console.log(secondDropdownOptions, "secondDropdownOptions");

    // Attach event listener to the first dropdown
    const firstDropdown = document.getElementById("first-dropdown");
    firstDropdown.addEventListener("change", function (event) {
      const selectedOption = event.target.value;
      // console.log(selectedOption);
      populateSecondDropdown(selectedOption, secondDropdownOptions);
    });

    populateSecondDropdown(firstDropdown.value, secondDropdownOptions);

    const secondDropdown = document.getElementById("second-dropdown");
    secondDropdown.addEventListener("change", function (event) {
      d3.select("#barchart").selectAll("*").remove();
      d3.select("#bc").selectAll("*").remove();
      d3.select("#tod").selectAll("*").remove();
      d3.select("#annual-cycle-histogram").selectAll("*").remove(); 
      const selectedOption = firstDropdown.value;
      const selectedValue = event.target.value;
      const filteredData = filterData(
        secondDropdownOptions,
        selectedOption,
        selectedValue,
        data
      );

      const barchart = new Barchart(
        { parentElement: "#barchart" },
        filteredData, dataStore
      );
     
      const timelineData = d3.rollups(filteredData, v => v.length, d => new Date(d.date_time).getDate());
      // console.log(timelineData, "timelineData");

      const tod = new TimeOfDayBarChart({ parentElement: "#tod" }, filteredData, 
      dataStore
      );

      const bc = new BC({
        data: filteredData,
        element: "#bc", // The selector for the container to hold the bar chart
        dataStore: dataStore
      });

    

      const timelineDataForCycleHist = d3.rollups(
        filteredData, v => v.length, d => (new Date(d.date_time).getMonth() + 1).toString() + "/" + new Date(d.date_time).getDate().toString() + "/" + new Date(d.date_time).getFullYear()
        ).map(([key, value]) => ({ date: parseTime2(key), close: value }));
        // console.log(timelineDataForCycleHist, "timelineData");

                const cycleHistogram = new CycleHistogram(
          { parentElement: "#annual-cycle-histogram" },
          timelineDataForCycleHist, dataStore
        );
  

    })

    // Process each data point
    data.forEach((d) => {
      d.latitude = d.latitude && !isNaN(d.latitude) ? +d.latitude : null;
      d.longitude = d.longitude && !isNaN(d.longitude) ? +d.longitude : null;
      d.encounter_length = d.encounter_length ? +d.encounter_length : null;
      if (d.encounter_length && !isNaN(d.encounter_length)) {
        encounterLengths.push(+d.encounter_length); // Unary plus ensures it's a number
      }

      // Increment notMappedCount if coordinates are missing
      if (!d.latitude || !d.longitude) {
        notMappedCount++;
      }

      // Handle UFO shape
      const shape = d.ufo_shape;
      if (shape && typeof shape === "string" && shape.toLowerCase() !== "na") {
        // const normalizedShape = shape.charAt(0).toUpperCase() + shape.slice(1).toLowerCase();
        shapes.add(shape);

        // Assign a color if not already done
        if (!shapeColors[shape]) {
          shapeColors[shape] = getRandomColorFromList();
        }
      }

      // Handle year
      const year = new Date(d.date_time).getFullYear();
      if (!isNaN(year)) {
        years.add(year);
      }
    });

    // only used for initial rendering
    const selectedOption = firstDropdown.value;
    const secondDropdownValue = secondDropdown.value;
    const filteredData = filterData(
      secondDropdownOptions,
      selectedOption,
      secondDropdownValue,
      data
    );


    const barchart = new Barchart({ parentElement: "#barchart" }, filteredData, 
    dataStore
    );
    const tod = new TimeOfDayBarChart({ parentElement: "#tod" }, filteredData, 
    dataStore
    );
    const bc = new BC({
      data: filteredData,
      element: "#bc", // The selector for the container to hold the bar chart
      // width: 1790,
      // height: 1200,
      dataStore: dataStore
    });

    const timelineData = d3.rollups(
      data, v => v.length, d => (new Date(d.date_time).getMonth() + 1).toString() + "/" + new Date(d.date_time).getDate().toString() + "/" + new Date(d.date_time).getFullYear()
      ).map(([key, value]) => ({ date: parseTime2(key), close: value }));
    timelineData.sort(function(a, b){
      let c = new Date(a.date);
      let d = new Date(b.date);
      return c-d;
    });


    let cycleHistogram = new CycleHistogram(
      { parentElement: "#annual-cycle-histogram" },
      timelineData, dataStore
    );
    const timeline = new Timeline({ parentElement: "#timeline" }, GroupByMonth(timelineData), data, filteredData, dataStore
    );

    document.getElementById('clear-brush-button').addEventListener('click', () => {
      dataStore.updateData(filteredData); 

      if (timeline.brushG && timeline.brush) {
        timeline.brushG.call(timeline.brush.move, null);
      }
    });


    // Convert sets to arrays for any further use
    uniqueYears = Array.from(years);
    uniqueShapes = Array.from(shapes);

    // Display the count of sightings not mapped
    const notMappedCountElement = document.getElementById(
      "sightings-not-mapped"
    );
    notMappedCountElement.innerHTML = `Sightings not mapped: ${notMappedCount}`;

    // Filter out data points with null latitude or longitude for mapping
    const mappedData = data.filter(
      (d) => d.latitude !== null && d.longitude !== null
    );
    // Initialize chart and then show it
    const leafletMap = new LeafletMap(
      { parentElement: "#my-map" },
      mappedData,
      shapeColors, dataStore
    );

    setupEventListeners(leafletMap, uniqueYears, uniqueShapes, shapeColors);
    
  }); 
function setupEventListeners(
  leafletMap,
  uniqueYears,
  uniqueShapes,
  shapeColors
) {
  // Listener for the color-by dropdown changes
  const optionSelect = document.getElementById("color-by-dropdown");
  optionSelect.addEventListener("change", function () {
    const selectedCategory = this.value;
    leafletMap.colorByPoints(selectedCategory, shapeColors); // Adjusted to pass shapeColors
  });

  // Add event listener to the background select dropdown
  const backgroundSelect = document.getElementById("map-background-select");
  backgroundSelect.addEventListener("change", function (event) {
    const selectedBaseLayer = event.target.value;
    leafletMap.changeBaseLayer(mapBackgrounds[selectedBaseLayer].layer);
  });
}

function getRandomColorFromList() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#9B59B6",
    "#E74C3C",
    "#2ECC71",
    "#3498DB",
    "#F39C12",
    "#8E44AD",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// functions/constants
const attributes = {
  city_area: {
    label: "City Area",
    color: "#d49b2a",
  },
  country: {
    label: "Country",
    color: "#b5732b",
  },
  date_documented: {
    label: "Date Documented",
    color: "#cfac38",
  },
  date_time: {
    label: "Date Time",
    color: "#8bbd53",
  },
  described_encounter_length: {
    label: "Described Encounter Length",
    color: "#367d3e",
  },
  description: {
    label: "Description",
    color: "#6539a3",
  },
  encounter_length: {
    label: "Encounter Length",
    color: "#8c2ed9",
  },
  latitude: {
    label: "Latitude",
    color: "#c447b6",
  },
  longitude: {
    label: "Longitude",
    color: "#b8407e",
  },
  state: {
    label: "State",
    color: "#156796",
  },
  ufo_shape: {
    label: "UFO Shape",
    color: "#072e73",
  },
};

// Map background options object
const mapBackgrounds = {
  OpenStreetMap_Mapnik: {
    label: "OpenStreetMap",
    layer: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
  },
  OpenStreetMap_CH: {
    label: "OpenStreetMap (Switzerland)",
    layer: L.tileLayer("https://tile.osm.ch/switzerland/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
  },
  OpenStreetMap_BZH: {
    label: "OpenStreetMap (BZH)",
    layer: L.tileLayer("https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
    }),
  },
  Stadia_AlidadeSmooth: {
    label: "Stadia (Alidade Smooth)",
    layer: L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "png",
      }
    ),
    // },
    // "Stadia_StamenToner": {
    //     label: "Stadia (Stamen Toner)",
    //     layer: L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
    //         minZoom: 0,
    //         maxZoom: 20,
    //         attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //         ext: 'png'
    //     })
  },
  // Add more options for different map backgrounds
};

function colorByFeature() {
  const colorByOptionsDiv = document.getElementById("color-by-options");

  const colorBySelect = document.createElement("select");
  colorBySelect.setAttribute("id", "color-by-select");

  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const option = document.createElement("option");
      option.setAttribute("value", key);
      option.textContent = attributes[key].label;
      colorBySelect.appendChild(option);
    }
  }
}

function colorByCategories() {
  const colorByDiv = document.getElementById("color-by");
  colorByDiv.style.display = "flex"; // Align children inline

  const selectElement = document.createElement("select");
  selectElement.id = "color-by-dropdown";

  const options = ["Year", "Month", "Time of Day", "UFO Shape"];

  options.forEach((optionText) => {
    const optionElement = document.createElement("option");
    optionElement.value = optionText.toLowerCase().replace(" ", "-");
    optionElement.textContent = optionText;
    selectElement.appendChild(optionElement);
  });

  colorByDiv.appendChild(selectElement);

  function clearDynamicElements() {
    const dynamicElement = document.getElementById("dynamic-element");
    if (dynamicElement) {
      colorByDiv.removeChild(dynamicElement);
    }
  }

  function createDropdown(options, id) {
    const selectElement = document.createElement("select");
    selectElement.id = id;
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
    return selectElement;
  }

  function createTimeOfDaySlider() {
    const container = document.createElement("div");
    container.style.display = "flex"; // Align children inline
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 1;
    slider.max = 4;
    slider.value = 1;
    slider.id = "time-of-day-slider";
    slider.classList.add("slider");

    const output = document.createElement("div");
    output.id = "slider-output";
    output.textContent = "Morning";
    // output.style.textAlign = 'center';

    const timeOfDayLabels = ["Morning", "Afternoon", "Evening", "Night"];

    slider.oninput = function () {
      output.textContent = timeOfDayLabels[this.value - 1];
    };
    const labelsContainer = document.createElement("div");

    container.appendChild(slider);
    container.appendChild(output);

    return container;
  }

  selectElement.addEventListener("change", function () {
    clearDynamicElements();

    const dynamicElement = document.createElement("div");
    dynamicElement.id = "dynamic-element";

    switch (this.value) {
      case "year":
        uniqueYears.sort((a, b) => a - b);
        // console.log(uniqueYears);
        // const yearsDropdown = createDropdown(uniqueYears, 'years-dropdown');
        // dynamicElement.appendChild(yearsDropdown);
        break;
      case "month":
        // const monthsDropdown = createDropdown(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 'months-dropdown');
        // dynamicElement.appendChild(monthsDropdown);
        break;
      case "time-of day":
        // const slider = createTimeOfDaySlider();
        // dynamicElement.appendChild(slider);
        break;
      case "ufo-shape":
        // console.log(uniqueShapes);
        // const shapesDropdown = createDropdown(uniqueShapes, 'shapes-dropdown');
        // dynamicElement.appendChild(shapesDropdown);
        break;
    }

    colorByDiv.appendChild(dynamicElement);
  });
}

function chooseMapBackground() {
  const backgroundOptionsDiv = document.getElementById(
    "map-background-options"
  );

  const backgroundSelect = document.createElement("select");
  backgroundSelect.setAttribute("id", "map-background-select");

  for (const key in mapBackgrounds) {
    if (mapBackgrounds.hasOwnProperty(key)) {
      const option = document.createElement("option");
      option.setAttribute("value", key);
      option.textContent = mapBackgrounds[key].label; // Use the label field from mapBackgrounds object
      backgroundSelect.appendChild(option);
    }
  }

  backgroundOptionsDiv.appendChild(backgroundSelect);
}

// Function to filter data based on the selected value in the second dropdown
function filterData(
  secondDropdownOptions,
  selectedOption,
  selectedValue,
  data
) {
  if (selectedOption === "date_time") {
    // Filter the data to include only entries with the selected year
    return data.filter((d) => {
      const date = new Date(d.date_time);
      return date.getFullYear() === Number(selectedValue);
    });
  } else if (secondDropdownOptions[selectedOption]) {
    return data.filter((d) => d[selectedOption] === selectedValue);
  } else {
    // If the selected option is not valid, return the original data
    return data;
  }
}

// Function to parse date_time entries and extract unique years
function extractUniqueYears(data) {
  const uniqueYears = new Set();
  data.forEach((d) => {
    // Split the date_time string by '/'
    const parts = d.date_time.split("/");
    if (parts.length === 3) {
      // Ensure the date_time format is valid
      // Extract the year part and add it to the set
      const year = parseInt(parts[2]);
      uniqueYears.add(year);
    }
  });
  // Convert the set to an array of unique years
  return Array.from(uniqueYears);
}

function GroupByMonth(data){
  let groupedData = [];
  let dayToMonth = data.map(x => ({...x, date: new Date(x.date.getFullYear(), x.date.getMonth(), 1)}));
  let sumPerMonth = dayToMonth.reduce((acc, cur) =>{
    acc[cur.date] = acc[cur.date] + cur.close || cur.close;
    return acc;
  }, {});
  groupedData = [];
  for(let i = 0; i < Object.keys(sumPerMonth).length; i++){
    let key = Object.keys(sumPerMonth)[i];
    let object = {
      date: new Date(key),
      close: sumPerMonth[key]
    }
    groupedData.push(object);
  }
  groupedData.sort(function(a, b){
    let c = new Date(a.date);
    let d = new Date(b.date);
    return c-d;
  });
  return groupedData;
}

chooseMapBackground();
colorByFeature();
colorByCategories();
