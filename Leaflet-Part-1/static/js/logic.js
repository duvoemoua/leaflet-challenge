// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team"
});

// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [20, -20],  
  zoom: 3,
  layers: [basemap]  
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

let baseMaps = {
  "Default Map": basemap,
  "Street Map": streetMap
};

let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Function to return style data for each earthquake marker
  function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 0.7,
        fillColor: getColor(feature.geometry.coordinates[2]), 
        color: "#000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
  }

  // Function to determine marker color based on depth
  function getColor(depth) {
    return depth > 90 ? "#FF0000" :  // Dark Red 
           depth > 70 ? "#FF4500" :  // Orange-Red
           depth > 50 ? "#FFA500" :  // Orange
           depth > 30 ? "#FFD700" :  // Golden Yellow
           depth > 10 ? "#FFFF00" :  // Yellow
                        "#ADFF2F";   // Light Green 
  }

  // Function to determine marker size based on magnitude
  function getRadius(magnitude) {
    return magnitude ? magnitude * 5 : 1;  // Adjusted for better visibility
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled.
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
          <strong>Magnitude:</strong> ${feature.properties.mag}<br>
          <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km<br>
          <strong>Location:</strong> ${feature.properties.place}
      `);
    }
  }).addTo(earthquakes);

  // Ensure the earthquake layer is added correctly.
  earthquakes.addTo(map);

  // Create and configure the legend to match expected format.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        depthLevels = [-10, 10, 30, 50, 70, 90],
        colors = ["#ADFF2F", "#FFFF00", "#FFD700", "#FFA500", "#FF4500", "#FF0000"]; 

    // Add title to legend
    div.innerHTML = "<strong>Depth (km)</strong><br>";

    // Loop through depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ` +
            `${depthLevels[i]}${depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+"}`;
    }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);
});

// OPTIONAL: Step 2
// Make a request to get our Tectonic Plate geoJSON data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
   

    // Ensure tectonic plate boundaries are added to the map.
    
});