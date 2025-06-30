# Attribution

## Tools und Frameworks

* Anzeige optimiert für Desktop-Browser, Tablet und Smartphone durch Verwendung von [Bootleaf]. Bootleaf basiert auf [Bootstrap 3] und [Leaflet].
* Mehrsprachigkeit mit Hilfe von [i18next]. Möglichkeit zwischen den Sprachen umzuschalten.
* Formatierung von MarkDown-Fragmenten in HTML mit [marked.js]
* Folgen der Route mit Hilfe von [Leaflet locateControl].
* Marker clustering bei höheren Zoomleveln zur Erhöhung der Anzeigegeschwindigkeit mit [Leaflet marker cluster plugin].s
* zur Anzeige der x/y Daten wird [Leaflet Coordinates Control] eingesetzt.
* Daten von [OpenStreetMap (OSM)]. Kartendarstellung durch OSM. OSM ist ein kollaboratives, Open-Source-Projekt zur Erstellung einer detaillierten und frei verfügbaren Weltkarte. Durch die aktive Beteiligung der globalen Mapper-Gemeinschaft bietet OSM flexible und umfangreiche geographische Daten, die in einer Vielzahl von Anwendungen genutzt werden können.</li>
* Zur Erstellung der Texte wurde [notebooklm] verwendet. Zusammenfassungen wurden mit Hilfe von [chatgpt] erzeugt. 
* Die Sprachsynthese wurde mit [TTS] von coquai erstellt. Dabei wurde für deutsch das model `tts_models/de/thorsten/tacotron2-DDC` und der vocoder `vocoder_models/de/thorsten/hifigan_v1` verwendet.

## Entwicklung

* [Wolfram Eberius]

[Bootleaf]: https://github.com/bmcbride/bootleaf
[Bootstrap 3]: http://getbootstrap.com/
[Leaflet]: http://leafletjs.com/
[i18next]: https://www.i18next.com/
[marked.js]: https://marked.js.org/
[Leaflet locateControl]: https://github.com/domoritz/leaflet-locatecontrol
[Leaflet marker cluster plugin]: https://github.com/Leaflet/Leaflet.markercluster
[Leaflet Coordinates Control]: https://github.com/zimmicz/Leaflet-Coordinates-Control/blob/master/Control.Coordinates.js
[OpenStreetMap (OSM)]: https://openstreetmap.org/
[notbooklm]: https://notebooklm.google.com/
[chatgpt]: https://openai.com/chatgpt/overview/
[TTS]: https://docs.coqui.ai/en/latest/index.html
[Wolfram Eberius]: https://weberius.github.io/