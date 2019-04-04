// Data URL with API
var dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//  GET request to the URL

d3.json(dataUrl, function(data) {

  // Sending the data.features object to createFeatures function

  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {

  // Popup feature for place/time of earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place +
      "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

function mapColor(d) {
  return d < 1 ? 'rgb(0,255,0)' :  
      d < 2  ? 'rgb(173,255,47)' :
      d < 3  ? 'rgb(255,215,0)' :
      d < 4  ? 'rgb(255,140,0)' :
      d < 5  ? 'rgb(255,127,80)' :
            'rgb(255,0,0)';
  }
  // Creating GeoJSON layer and running Run onEachFeature function for data array
  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      
      color=mapColor(feature.properties.mag);

      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Sending earthquake layer to createMap function

  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Defining streetmap and darkmap layers

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiZ3JhaGFtYjAwMSIsImEiOiJjam4weHN6eTgxY20yM3BwNzhkaDcyd3pxIn0.lpyPTjgm2HokKQNACXcWEA." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Defining baseMap object to the base layers

  var baseMaps = {
    "Street Map": streetmap
  };

  // Overlay object for overlay layer

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Creating map with streetmap and earthquakes layers

  var myMap = L.map("map", {
    center: [
      38.54865, -90.25703
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(0,255,0)' :  
            d < 2  ? 'rgb(173,255,47)' :
            d < 3  ? 'rgb(255,215,0)' :
            d < 4  ? 'rgb(255,140,0)' :
            d < 5  ? 'rgb(255,127,80)' :
                      'rgb(255,0,0)'; 
  }

  // Creating legend for the map

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5];
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // looping over density intervals/generating label 

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}
