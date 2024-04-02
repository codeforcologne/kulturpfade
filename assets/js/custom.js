// Enter your custom JavaScript code here

function beforeMapLoads(){
	console.log("Before map loads function");

    if (getURLParameter("id") == '05170024-b01-t01') {
        config.title = "Pfad Moers";
        config.start.center = [51.45165,6.62628];
        config.start.zoom = 13;
    } else if (getURLParameter("id") == '05315000-b03-t01') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 1";
        config.start.center = [50.944511,6.849597];
        config.start.zoom = 14;
    } else if (getURLParameter("id") == '05315000-b03-t02') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 2";
        config.start.center = [50.914635,6.895562];
        config.start.zoom = 14;
    } else if (getURLParameter("id") == '05315000-b03-t03') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 3";
        config.start.center = [50.943948,6.878361];
        config.start.zoom = 16;
    } else if (getURLParameter("id") == '05315000-b03-t04') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 4";
        config.start.center = [50.920348,6.92962];
        config.start.zoom = 15;
    } else if (getURLParameter("id") == '05315000-b03-t05') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 5";
        config.start.center = [50.928895,6.914447];
        config.start.zoom = 15;
    } else if (getURLParameter("id") == '05315000-b03-t06') {
        config.title = "Kulturpfade Köln - Lindenthal Pfad 6";
        config.start.center = [50.931234,6.894532];
        config.start.zoom = 15;
    } else if (getURLParameter("id") == '06634005') {
        config.title = "Fotopfad Fritzlar";
        config.start.center = [51.131928,9.273232];
        config.start.zoom = 17;
    } else if (getURLParameter("id") == '06634009') {
        config.title = "Fotopfad Homberg";
        config.start.center = [51.033723,9.405627];
        config.start.zoom = 17;
    } else if (getURLParameter("id") == 'brunnentour') {
        config.title = "Fotopfad Brunnentour";
        config.start.center = [50.937994,6.959521];
        config.start.zoom = 17;
    } else if (getURLParameter("id") == 'muelheim') {
        config.title = "Fotopfad Mülheim";
        config.start.center = [50.96167,7.003527];
        config.start.zoom = 16;
    } else {
        config.title = "Fotopfad Köln";
        config.start.center = [50.93551,6.953081];
        config.start.zoom = 14;
    }

    document.getElementById('brand').innerText = config.title;

console.log("Load map");

	loadMap();

}

function afterMapLoads(){
	// This function is run after the map has loaded. It gives access to bootleaf.map, bootleaf.TOCcontrol, etc

	console.log("After map loads function");

	// Check to see whether the Gray basemap is chosen, and the user has zoomed in too far. In this case,
	// switch to the Streets basemap
	bootleaf.map.on("zoomend", function(evt){
		if (bootleaf.currentBasemap === 'Gray'){
			if (evt.target._zoom >= 17) {
				setBasemap({"type": 'esri', "id": 'Streets'});
				$.growl.warning({ title: "Basemap change", message: "The grayscale basemap is not available at this scale"});
			}
		}
	});

	// Detect the coordinates of the address returned by the geocoder. This can be used elsewhere as required
	bootleaf.leafletGeocoder.on("markgeocode", function(evt){
		console.log("Coordinates: ", evt.geocode.center.lat, ", ", evt.geocode.center.lng);
	});
}
