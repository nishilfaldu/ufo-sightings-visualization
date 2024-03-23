d3.csv('data/ufo_sightings.csv')
.then(data => {
    console.log(data);
    console.log(data.length);

    let notMappedCount = 0;
    data.forEach(d => {
        d.latitude = d.latitude && !isNaN(d.latitude) ? +d.latitude : null;
        d.longitude = d.longitude && !isNaN(d.longitude) ? +d.longitude : null;
        d.encounter_length = d.encounter_length ? +d.encounter_length : null;
        if (!d.latitude || !d.longitude) {
            console.log(d, "d")
            notMappedCount++;
        }
      });

    // Filter out data points with null latitude or longitude
    data = data.filter(d => d.latitude !== null && d.longitude !== null);

    // Display the count of sightings not mapped
    const notMappedCountElement = document.getElementById("sightings-not-mapped");
    notMappedCountElement.innerHTML = `Sightings not mapped: ${notMappedCount}`;
    // document.getElementById('my-map').appendChild(notMappedCountElement);

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));