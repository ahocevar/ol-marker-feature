import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { useGeographic } from 'ol/proj.js';
import Popup from 'ol-popup';
import Marker from '../src/index.js';

useGeographic();

const map = new Map({
  target: 'map',
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({ center: [16.351, 48.277], zoom: 15 }),
});

const marker = new Marker([16.351, 48.277]);
marker.setMap(map);
marker.set('info', 'A pretty CSS3 popup.<br> Easily customizable.');

const popup = new Popup({ offset: [0, -32] });
map.addOverlay(popup);

marker.on('click', () => {
  popup.show(marker.getLocation(), marker.get('info'));
});
marker.dispatchEvent('click');
