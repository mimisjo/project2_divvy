// Function to determine marker size based on trips
function markerSize(combined) {
    return combined / 900;
}

// Getting station data
var urlMap = '/station_map';

d3.json(urlMap).then(function (stations) {
    console.log(stations);

    // Define array to hold station markers
    var locMarkers = [];
    var busyMarkers = [];

    // Loop through stations and create markers
    for (var i = 0; i < stations.length; i++) {
        stations[i].coordinates = stations[i].coordinates.replace(" ", "").split(","); 

        locMarkers.push(
            L.circle(stations[i].coordinates, {
                stroke: false,
                fillOpacity: 0.8,
                color: "#F3D250",
                fillColor: "#F3D250",
                radius: 100
            }).bindPopup("<h6>" + stations[i].name + "</h6><hr><h6>Launch Year: "+ stations[i].launch +"</h6><h6>No. of Docks: " + stations[i].docks + "</h6>")
        );

        busyMarkers.push(
            L.circle(stations[i].coordinates, {
                stroke: false,
                fillOpacity: 0.6,
                color: "#F78888",
                fillColor: "#F78888",
                radius: markerSize(stations[i].combined)
            }).bindPopup("<h6>" + stations[i].name + "</h6><hr><h6>Launch Year: "+ stations[i].launch +"</h6><h6>No. of Docks: " + stations[i].docks + "</h6>")
        );
    };

    // .bindPopup("<h1>" + stations[i].name + "</h1><hr><h3>All Trips: "+ stations[i].combined+"</h3><hr> <h3>Launch Year: " + stations[i].launch + "</h3>").addTo(map)

    // Define variables for base layers
    var streetmap =
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.run-bike-hike",
        accessToken: "pk.eyJ1IjoibWltaXNqbyIsImEiOiJjandkbmJ3a3gwbGtuNDlvdWZrMXo4c3dtIn0.lzMmRtCgEIEW4ZpdEUPSLA"
    });

    // Create layer groups
    var loc = L.layerGroup(locMarkers);
    var busy = L.layerGroup(busyMarkers);

    // Create a baseMaps object
    var baseMaps = {
    "Street Map": streetmap,
    };

    // Create an overlay object
    var overlayMaps = {
        "Station Activity": busy,
        "Station Location": loc
    };

    // Define a map object
    var map =
    // L.map('mapid').setView([41.8781, -87.6298], 13);
    L.map("mapid", {
        center: [
            41.8781, -87.6298
        ],
        zoom: 13,
        layers: [streetmap, loc, busy]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);


});


// var link = "https://data.cityofchicago.org/resource/y6yq-dbs2.geojson"

// d3.json(link, function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     L.geoJson(data).addTo(map);
//   });