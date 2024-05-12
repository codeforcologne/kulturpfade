var map, featureList;
var urlroute, urlpoi;

// get namespace from urlParameter
if (getURLParameter("id")) {
  namespace = getURLParameter("id");
} else {
  namespace = config.start.id;
}

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModalDiv").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(routes.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/**************************************************************************************************/
// FILL TABLE
/**************************************************************************************************/

$("#legend-btn").click(function() {

    var urldata;

    if (getURLParameter("id")) {
      urldata = "service/data/" + getURLParameter("id") +  ".json"
    } else {
      urldata = "service/data/" + config.start.id +  ".json";
    }

  // datatable
  $(document).ready(function() {
  	$('#culturalpath').DataTable({
  	    ajax: {
            url: urldata,
            dataSrc: 'data'
        },
  		"searching": false,
  		"paging": false,
  		"ordering": false,
  		"info": false,
  		"retrieve": true,
  		"columns" : [ {
  			"data" : "name"
  		}, {
  			"data" : "time"
  		}, {
  			"data" : "distance"
  		} ]
  	});
  });

  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through pois layer and add only features which are in the map bounds */
  pois.eachLayer(function (layer) {
    if (map.hasLayer(poiLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody")
          .append('<tr class="feature-row" id="'
            + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng
            + '"><td style="vertical-align: middle;text-align: right" class="feature-nr">' + layer.feature.properties.nr + '</td><td class="feature-name">'
            + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-nr", {
    order: "asc"
  });
}

/* Basemap Layers */
var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

/**************************************************************************************************/
// ROUTE LAYER
/**************************************************************************************************/

var routes = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    layer.on({
       click: function (e) {
         $("#feature-title").html("Entfernung");
         $("#feature-info").html("Entfernung zur nächsten Sehenwürdigkeit: "
            + feature.properties.distance
            + "<br/> Voraussichtliche Dauer ohne Pause: "
            + feature.properties.time);
         $("#featureModal").modal("show");
       }
    });
  }
});

/**************************************************************************************************/
// GET ROUTE
/**************************************************************************************************/

urlroute = "service/route/" + namespace +  ".geojson"

fetch(urlroute, {
  method: 'HEAD' // Verwende die HEAD-Methode, um nur den Header abzurufen
}).then(response => {
    if (response.ok) {
      $.getJSON(urlroute, function (data) {
        routes.addData(data);
      });
    } else {
      console.log('Die Seite wurde nicht gefunden.');
      urlroute = "service/route/" + config.start.id +  ".geojson";
      $.getJSON(urlroute, function (data) {
        routes.addData(data);
      });
    }
  }).catch(error => {
    console.error('Ein Fehler ist aufgetreten:', error);
  });


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/**************************************************************************************************/
// POI LAYER
/**************************************************************************************************/

/* Empty layer placeholder to add to layer control for listening when to add/remove pois to markerClusters layer */
var poiLayer = L.geoJson(null);

var pois = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'red-tooltip',
        html: '<div class="icon-container">' + feature.properties.nr + '</div>',
        iconSize: [40, 30],
        iconAnchor: [20, 10]
      }),
      title: feature.properties.nr,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {

console.log('### POI LAYER ### ' + languageCode);

      var content = "";
      var url = 'locales/' + namespace + '/' + languageCode + '/p' + feature.properties.nr + '.html';

      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Die Antwort als Text abrufen
      }).then(htmlFragment => {
        // Das HTML-Fragment in den DOM einfügen
        content = htmlFragment;
      }).catch(error => {
        console.error('Beim Abrufen des HTML-Fragments ist ein Fehler aufgetreten:', error);
      });

      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.nr + ' ' + feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody")
        .append('<tr class="feature-row" id="'
        + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng
        + '"><td style="vertical-align: middle;">' + layer.feature.properties.nr + '</td><td class="feature-name">'
        + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

      var tooltipOptions = {
        offset: [10, -50],
        iconAnchor: [20, 10],
        className: 'leaflet-tooltip'
      };
      layer.bindTooltip('<div class="leaflet-tooltip">'
      + layer.feature.properties.name
      + '</div>', tooltipOptions).openTooltip();

    }
  }
});

/**************************************************************************************************/
// GET POIs
/**************************************************************************************************/

function loadPoiLayer() {

    urlpoi = "service/poi/" + namespace +  ".geojson"

    // Schicht entfernen, falls bereits vorhanden
    if (poiLayer) {
        // remove layer from map
        this.map.removeLayer(poiLayer);
        // remove layer from markercluster
        pois.clearLayers();
    }

    fetch(urlpoi, {
      method: 'HEAD' // Verwende die HEAD-Methode, um nur den Header abzurufen
    }).then(response => {
        if (response.ok) {
          $.getJSON(urlpoi, function (data) {
              pois.addData(data);
              map.addLayer(poiLayer);
          });
        } else {
          console.log('Die Seite wurde nicht gefunden.');
          urlpoi = "service/poi/" + config.start.id +  ".geojson";
          $.getJSON(urlpoi, function (data) {
              pois.addData(data);
              map.addLayer(poiLayer);
          });
        }
      }).catch(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
      });
}

map = L.map("map", {
  zoom: 14,
  center: [50.944511,6.849597],
  layers: [osm, routes, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === poiLayer) {
    markerClusters.addLayer(pois);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === poiLayer) {
    markerClusters.removeLayer(pois);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);


/**************************************************************************************************/
// attributionControl
/**************************************************************************************************/
loadAttributionControl();

function loadAttributionControl() {

    var attributionControl = L.control({
      position: "bottomright"
    });
    attributionControl.onAdd = function (map) {
      var div = L.DomUtil.create("div", "leaflet-control-attribution");

      var url = 'locales/' + namespace + '/' + languageCode + '/attributionControl.html';
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Die Antwort als Text abrufen
      }).then(htmlFragment => {
        // Das HTML-Fragment in den DOM einfügen
        div.innerHTML = htmlFragment;
      }).catch(error => {
        console.error('Beim Abrufen des HTML-Fragments ist ein Fehler aufgetreten:', error);
      });

      return div;
    };

    map.addControl(attributionControl);
}

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);


/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  showCompass: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 5,
    clickable: false
  },
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": osm
};

var groupedOverlays = {
  "Sehenswürdigkeiten": {
    "Sehenswürdigkeiten": poiLayer
  },
  "Kulturpfade": {
    "Lindenthal": routes
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);


$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/**************************************************************************************************/
// AJAX STOP; do something if all is loaded
/**************************************************************************************************/
$(document).one("ajaxStop", function () {
  sizeLayerControl();
  /* Fit map to routes bounds */
  map.fitBounds(routes.getBounds());
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

/**************************************************************************************************/
// DOWNLOAD MENU
/**************************************************************************************************/

/**
Checks for existence of an URL.
After then it appends a new Download Childe
*/
class Downloader {

    constructor(urlparameter) {
        this.url = urlparameter.getUrl();
        this.path = urlparameter.getPath();
        this.id = urlparameter.getId();
        this.type = urlparameter.getType();
    }

    buildDownload() {
        fetch(this.url, {
          method: 'HEAD' // Verwende die HEAD-Methode, um nur den Header abzurufen
        }).then(response => {
          if (response.ok) {
            console.log('Elements for download initialized.');
            var newLi, targetElement;
            newLi = document.createElement('li');
            newLi.innerHTML = '<a href="service/' + this.path + '/' + this.id + '.' + this.type + '" download="' + this.id + '.' + this.type + '" target="_blank" data-toggle="collapse" data-target=".navbar-collapse.in"><i class="fa fa-download"></i>&nbsp;&nbsp;' + this.path + ' als ' + this.type + '</a>';
            targetElement = document.getElementById('downloadDropUl');
            targetElement.appendChild(newLi);
          } else {
            console.log('No data for download found.');
          }
        }).catch(error => {
          console.error('Ein Fehler ist aufgetreten:', error);
        });
    }

}

/*
This class constructs an url out of urlparameter and returns url, id, path, type
*/
class URLParameter {

    constructor() {
        if (getURLParameter("id")) {
            this.id = getURLParameter("id");
        } else {
            this.id = config.start.id;
        }
    }

    getURLParameter(name) {
        return decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)
          || [null, ''])[1].replace(/\+/g, '%20')
        ) || null;
    }

    getId() {
        return this.id;
    }

    getUrl() {
        return "service/" + this.path + "/" + this.id + "." + this.type;
    }

    getPath() {
        return this.path;
    }

    getType() {
        return this.type;
    }

}

/**
This class extends URLParameter and defines path and type. Use like this:
new URLParameterGPX().getUrl();
*/
class URLParameterGPX extends URLParameter {

    path = "gpx";
    type = "gpx";
}

class URLParameterPoi extends URLParameter {

    path = "poi";
    type = "geojson";
}

new Downloader(new URLParameterGPX()).buildDownload();
new Downloader(new URLParameterPoi()).buildDownload();


/**
* Klasse, um html fragmente in Abhaengigkeit von der Sprache in den DOM-Tree einzufuegen.
* Benutzung: new ModalBuilder('aboutModal').build(i18next.language);
*/
class ModalBuilder {

     build(elementByid, languageCode) {

         //console.log(elementByid + ":" + languageCode);

         const url = 'locales/' + namespace + '/' + languageCode + '/' + elementByid + '.html';
         fetch(url).then(response => {
             if (!response.ok) {
               throw new Error('Network response was not ok');
             }
             return response.text(); // Die Antwort als Text abrufen
         }).then(htmlFragment => {
             // Das HTML-Fragment in den DOM einfügen
             const element = document.getElementById(elementByid);
             element.innerHTML = htmlFragment;
         }).catch(error => {
             console.error('Beim Abrufen des HTML-Fragments ist ein Fehler aufgetreten:', error);
         });
     }

}