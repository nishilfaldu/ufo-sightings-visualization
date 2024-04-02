# UFO Sightings Visualization

Data visualization about UFO sightings

This project was created with [D3.js](https://d3js.org/), [TopoJSON](https://github.com/topojson/topojson), JavaScript, HTML, and CSS.

To run this code, use the Live Preview Extension by Microsoft within Visual Studio Code. Simply download the extension, right-click on index.html, and choose the "Show Preview" option.
---
## Table of Contents
- [Motivation](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#motivation)
- [Data Used](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#data-used)
- [Visualization Component](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#visualization-component)
- [Sketches & Justification](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#sketches--documentation)
- [Discover](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#discover)
- [Process](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#process)
- [Demo Video](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#demo-video)
- [Distribution of Tasks](https://github.com/nishilfaldu/ufo-sightings-visualization/tree/documentation/SetupDocumentation?tab=readme-ov-file#distribution-of-tasks)

---

### Motivation
The motivation behind this project is to help users understand and find patterns in data of UFO sightings. A variety of visualizations and ways to compare them should allow a user to draw various conclusions about what types of UFO sightings are reported, and correlate them with:
- Geographical Location
- Date
- Time of Year (such as by month, season, day of week, etc.)
- Length of Reported Encounter
- Time of Day
- Words used to describe encounter
 
---

### Data Used

The dataset was obtained from the [National UFO Reporting Center](https://nuforc.org/). It includes a significant amount of information over UFO sightings, with over 80 thousand unique encounters, including dates, times, locations, and descriptions. The raw data can be found within the data folder of the project.

---

### Visualization Component

There are several visualization components, which will allow a user to view, compare, and draw conclusions from the data. These include:
- An interactive map with locations of various encounters. This map can be zoomed and panned with the mouse, as well as brushed using a toggle. Points on the map are colored, and may be recolored using the above dropdown by year, month, time of day, and UFO shape.
- A timeline, which can be brushed to see finer details. This tracks changes in the number of UFO sightings by month.
- A Bar Chart that will allow the user to see different cycles in UFO sighting frequency. A dropdown above will allow the user to sort the bars by day of the week, season, and month.
- A Bar Chart that organizes the data by UFO shape, allowing the user to see which shapes are the most common.
- A Bar Chart allowing the user to organize the data by time of day (such as morning, evening, etc.)
- A Histogram that will allow a user to compare UFO encounters by length.
In each of the above charts, hovering over a datapoint will allow a user to see more detailed data, such as the exact date, frequency, or description. This varies by the chart.

---

### Sketches & Justification

Several sketches were made to aid in the design process:
- For the B goals: ![B Goal sketches](https://i.imgur.com/phsYBpZ.png)
- For the A goals: ![A Goal sketches](https://i.imgur.com/h59P4Yn.png)
- For organizing data: ![Organizing Data sketches](https://i.imgur.com/jmSwJmw.png) ![More organizing data sketches](https://i.imgur.com/D2WAKg6.png)
- For trends in data: ![Data trends sketches](https://i.imgur.com/3kT9Lao.png)

---

### Discover

This application could allow a user to discover many things. Here are some examples of things users could look for in the application, as well as what conclusions users may draw from them.

- Reported UFO sightings have broadly become more common as time as gone on. This could be because reports are easier to make, or because there are more things in the sky, such as satellites, airplanes, and other phenomena that may be mistaken for UFOs.
- UFO sightings are more common when people are more likely to be outside, such as on weekends, in the summer, and in afternoons and evenings, when most people are done with work.
- UFO sightings are the most common in July. This could be due to Independence Day celebrations in the US being mistaken for UFOs.
  
There are many more conclusions to draw from these visualizations, which the user can find easily with this application.

---

### Process

---

### Demo Video

---

### Distribution of Tasks

---
