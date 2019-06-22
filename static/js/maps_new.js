// Function to determine marker size based on total trips
function markerSize(combined) {
    return combined;
}

// Function to create the map
function createMap(bikeStations) {

    // Create the tile layer that will be the background of our map
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.run-bike-hike",
        accessToken: "pk.eyJ1IjoibWltaXNqbyIsImEiOiJjandkbmJ3a3gwbGtuNDlvdWZrMXo4c3dtIn0.lzMmRtCgEIEW4ZpdEUPSLA"
    });

    // Create a baseMaps object
    var baseMaps = {
        "Street Map": streetmap,
    };

    // Create an overlay object
    var overlayMaps = {
        // "Station Location": loc,
        "Station Activity": busy
    };

    // Define a map object
    var map = L.map("mapid", {
        center: [
            41.8781, -87.6298
        ],
        zoom: 12,
        layers: [streetmap, busy]
    });
    // L.map('mapid').setView([41.8781, -87.6298], 13);

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}


// Function to create markers
function createMarkers(stations) {

    // Initialize array to hold station markers
    var busyMarkers = [];
    // var locMarkers = [];

    // Loop through stations and create markers
    for (var i = 0; i < stations.length; i++) {
        var station = stations[index];

        // For each station, create a marker and bind a popup with the station's name
        var busyMarker = L.circle(station.coordinates, {
            stroke: false,
            fillOpacity: 0.75,
            color: "#F78888",
            fillColor: "#F78888",
            radius: markerSize(station.combined)
        }).bindPopup("<h3>" + station.name + "<h3><hr><h4>All Trips: " + station.combined + "</h4><h4>Launch Year: " + station.launch + "<h4>");

        // locMarkers.push(
        //     L.circle(data[i].coordinates, {
        //         stroke: false,
        //         fillOpacity: 0.75,
        //         color: "#F3D250",
        //         fillColor: "#F3D250",
        //         radius: 100
        //     })
        // );

        busyMarkers.push(busyMarker);
    }

    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(busyMarkers));
}

// Getting station data
var urlMap = '/station_map';

// Get station information. Call createMarkers when complete
d3.json(urlMap, createMarkers);





// var link = "https://data.cityofchicago.org/resource/y6yq-dbs2.geojson"

// d3.json(link, function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     L.geoJson(data).addTo(map);
//   });