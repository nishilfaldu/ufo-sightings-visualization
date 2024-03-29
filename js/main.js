var parseTime = d3.timeParse("%m/%d/%Y %H:%M");
var date_array = {};
let ufo_frequency = "date,close\n";

d3.csv("data/ufo_sightings.csv")
  .then((data) => {
    // console.log(data);
    // console.log(data.length);

    let notMappedCount = 0;
    data.forEach((d) => {
      d.latitude = d.latitude && !isNaN(d.latitude) ? +d.latitude : null;
      d.longitude = d.longitude && !isNaN(d.longitude) ? +d.longitude : null;
      d.encounter_length = d.encounter_length ? +d.encounter_length : null;
      if (!d.latitude || !d.longitude) {
        // console.log(d, "d");
        notMappedCount++;
      }
      //   var dateTime = parseTime(d.date_time.split(" ")[0]);
      //   var date = dateTime.split(" ")[0];
      var justDate = d.date_time.split(" ")[0];
      var dateTime = justDate.split('/')[0] + '/1/' + justDate.split('/')[2];
      date_array[dateTime] = (date_array[dateTime] || 0) + 1;
    });

    date_array = sortByDates(date_array);
    let csv = convertToCSV(date_array);

    console.log(csv);

    // Filter out data points with null latitude or longitude
    data = data.filter((d) => d.latitude !== null && d.longitude !== null);

    // // Display the count of sightings not mapped
    const notMappedCountElement = document.getElementById(
      "sightings-not-mapped"
    );
    notMappedCountElement.innerHTML = `Sightings not mapped: ${notMappedCount}`;

    // Initialize chart and then show it
    // let leafletMap = new LeafletMap({ parentElement: "#my-map" }, data);

    // Add event listener to the background select dropdown
    const backgroundSelect = document.getElementById("map-background-select");
    backgroundSelect.addEventListener("change", function (event) {
      //   console.log(event.target.value);
      const selectedBaseLayer = event.target.value;
      //   console.log(mapBackgrounds[selectedBaseLayer].layer);
      leafletMap.changeBaseLayer(mapBackgrounds[selectedBaseLayer].layer);
    });

    d3.csv("data/ufo_frequency.csv")
      .then((data) => {
        console.log("before data read");
        console.log(data);
        console.log(data.length);
        data.forEach((d) => {
          d.close = parseFloat(d.close); // Convert string to float
          d.date = parseTime2(d.date); // Convert string to date object
        });

        // Initialize and render chart
        let timeline = new Timeline({ parentElement: "#timeline" }, data);
        timeline.updateVis();
      })
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error));

const parseTime2 = d3.timeParse("%m/%d/%Y");

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
  },
  Stadia_StamenToner: {
    label: "Stadia (Stamen Toner)",
    layer: L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "png",
      }
    ),
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

  // Append the select element to the div
  colorByOptionsDiv.appendChild(colorBySelect);
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

function sortByDates(dates) {
  let keys = Object.keys(dates);
  console.log("keys: ", keys);
  keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let r = [];
  for(let i = 0; i < keys.length; i++){
    let object = new Object();
    object.date = keys[i];
    object.close = dates[keys[i]];
    r.push(object);
  }

  return r;
}

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr)

  return array.map(it => {
    return Object.values(it).toString()
  }).join('\n')
}

chooseMapBackground();
colorByFeature();
