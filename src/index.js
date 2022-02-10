import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { getUid } from 'ol/util.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

/**
 * @type {Object<string, VectorLayer<VectorSource>>}
 * @private
 */
const _layersByMapUid = {};

/**
 * @param {import("ol/MapBrowserEvent.js").default} event
 */
function hoverHandler(event) {
  const map = /** @type {import("ol/Map.js").default} */ (event.target);
  const cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';
  map.getViewport().style.cursor = cursor;
}

/**
 * @param {import("ol/MapBrowserEvent.js").default} event
 */
function clickHandler(event) {
  const map = /** @type {import("ol/Map.js").default} */ (event.target);
  const features = /** @type {Array<Feature>} */ (map.getFeaturesAtPixel(event.pixel));
  if (features.length) {
    const feature = features[0];
    const layer = _layersByMapUid[getUid(map)];
    if (layer.getSource().hasFeature(feature)) {
      feature.dispatchEvent('click');
    }
  }
}

/**
 * @typedef {Object} MarkerOptions
 * @property {import("ol/coordinate.js").Coordinate} position Position of the marker in view
 * coordinates.
 * @property {string} [markup] Info markup associated with the marker. Can be used e.g. as popup
 * content.
 * @property {import("ol/style/Style.js").default} [style] Style of the marker.
 * @property {import("ol/Map.js").default} [map] Map to add the marker to.
 */

/**
 * @class Marker
 * @fires 'click'
 */
class Marker extends Feature {
  /**
   * @param {MarkerOptions} options
   */
  constructor(options) {
    super({
      geometry: new Point(options.position),
      markup: options.markup,
    });

    /**
     * @type {import("ol/Map.js").default|null}
     * @private
     */
    this._map = null;

    if (options.style === undefined) {
      import('./style.js').then((imported) => {
        this.setStyle(imported.default);
      });
    } else {
      this.setStyle(options.style);
    }
    if (options.map) {
      this.setMap(options.map);
    }
  }

  /**
   * Get the position of the marker.
   * @returns {import("ol/coordinate.js").Coordinate} Position of the marker in view coordinates.
   */
  getPosition() {
    return this.getGeometry().getCoordinates();
  }

  /**
   * Set the position of the marker.
   * @param {import("ol/coordinate.js").Coordinate} position Position of the marker in view
   * coordinates.
   */
  setPosition(position) {
    this.getGeometry().setCoordinates(position);
  }

  /**
   * Get the markup for this marker.
   * @returns {string} Markup associated with the marker.
   */
  getMarkup() {
    return this.get('markup');
  }

  /**
   * Set the markup for this marker. Can be used e.g. as popup content.
   * @param {string} markup Markup associated with the marker.
   */
  setMarkup(markup) {
    this.set('markup', markup);
  }

  /**
   * Adds the marker to the specified map.
   * @param {import("ol/Map.js").default|null} map Map to add the marker to. Call with `null` to
   * remove the marker from any map.
   */
  setMap(map) {
    if (this._map) {
      const source = _layersByMapUid[getUid(this._map)].getSource();
      source.removeFeature(this);
      if (source.isEmpty()) {
        this._map.un('pointermove', hoverHandler);
        this._map.un('click', clickHandler);
        delete _layersByMapUid[getUid(this._map)];
      }
    }
    if (map) {
      let layer = _layersByMapUid[getUid(map)];
      if (!layer) {
        layer = new VectorLayer({
          source: new VectorSource(),
          map,
        });
        _layersByMapUid[getUid(map)] = layer;
        map.on('pointermove', hoverHandler);
        map.on('click', clickHandler);
      }
      layer.getSource().addFeature(this);
    }
    this._map = map;
  }

  /**
   * Clean up when this marker is no longer needed.
   */
  dispose() {
    this.setMap(null);
    super.dispose();
  }
}

export default Marker;
export { _layersByMapUid };
