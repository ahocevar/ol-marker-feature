import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { getUid } from 'ol/util.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

/** @private @typedef {import("ol/Map.js").default} ol_Map */
/** @private @typedef {import("ol/coordinate.js").Coordinate} ol_coordinate_Coordinate */
/** @private @typedef {import("ol/geom/Geometry.js").default} ol_geom_Geometry */
// eslint-disable-next-line max-len
/** @private @typedef {import("ol/Feature.js").ObjectWithGeometry<import("ol/geom/Geometry.js").default>} objectWithGeometry */

/**
 * @private
 * @type {Object<string, VectorLayer<VectorSource>>}
 */
const _layersByMapUid = {};

/**
 * @private
 * @param {import("ol/MapBrowserEvent.js").default} event
 */
function _hoverHandler(event) {
  const map = /** @private @type {import("ol/Map.js").default} */ (event.target);
  const cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';
  map.getViewport().style.cursor = cursor;
}

/**
 * @private
 * @param {import("ol/MapBrowserEvent.js").default} event
 */
function _clickHandler(event) {
  const map = /** @private @type {ol_Map} */ (event.target);
  const features = /** @private @type {Array<Feature>} */ (map.getFeaturesAtPixel(event.pixel));
  if (features.length) {
    const feature = features[0];
    const layer = _layersByMapUid[getUid(map)];
    if (layer.getSource().hasFeature(feature)) {
      feature.dispatchEvent('click');
    }
  }
}

class Marker extends Feature {
  /**
   * `import Marker from 'ol-marker-feature';`
   *
   * This plugin provides an easy way to add markers to an OpenLayers map and associate them with
   * popups, e.g. using [ol-popup](https://npmjs.com/package/ol-popup).
   *
   * A `Marker` is basically an
   * [`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html). When it
   * is added to a map, the plugin will create an unmanaged layer for the map's marker features. It
   * will also set up `pointermove` and `click` listeners to change the cursor when the user hovers
   * over a marker, and to dispatch a `click` event on the `Marker` when it is clicked.
   *
   * Fires
   *  * `click` when the marker is clicked.
   *
   * @param {ol_coordinate_Coordinate|
   *   ol_geom_Geometry|
   *   objectWithGeometry} coordOrGeomOrOptions
   * Coordinates of a point marker, a geometry, or an object with a `geometry` property. When only
   * coordinates are provided  (e.g. `new Marker([16, 48])`), a marker with the
   * [default style](#style) is created.
   */
  constructor(coordOrGeomOrOptions) {
    let useDefaultStyle = false;
    if (Array.isArray(coordOrGeomOrOptions)) {
      coordOrGeomOrOptions = new Point(coordOrGeomOrOptions);
      useDefaultStyle = true;
    }
    super(coordOrGeomOrOptions);

    if (!this.getGeometry()) {
      throw new Error('Marker must have a geometry');
    }

    if (useDefaultStyle) {
      import('./style.js').then((imported) => {
        this.setStyle(imported.default);
      });
    }

    /**
     * @private
     * @type {import("ol/Map.js").default|null}
     */
    this._map = null;
  }

  /**
   * Get the location of the marker feature. For points, this will be the point itself.
   * For other geometry types, it will be a point on the geometry. Use this method e.g. for
   * displaying a popup at the marker feature's location.
   * @returns {ol_coordinate_Coordinate} Location of the marker in view coordinates.
   */
  getLocation() {
    /** @type {import("ol/geom/Geometry").default} */
    const geometry = this.getGeometry();
    switch (geometry.getType()) {
      case 'Point':
        return /** @private @type {import("ol/geom/Point.js").default} */ (geometry)
          .getCoordinates();
      case 'Circle':
        return /** @private @type {import("ol/geom/Circle.js").default} */ (geometry)
          .getCenter();
      case 'LineString':
        return /** @private @type {import("ol/geom/LineString.js").default} */ (geometry)
          .getCoordinateAt(0.5);
      case 'Polygon':
        return /** @private @type {import("ol/geom/Polygon.js").default} */ (geometry)
          .getInteriorPoint().getCoordinates().slice(0, 2);
      default:
        throw new Error('Unsupported geometry type. Expected "Point", "Circle", "LineString" or "Polygon".');
    }
  }

  /**
   * Adds the marker to the specified map.
   * @param {ol_Map|null} map Map to add the marker to. Call with `null` to
   * remove the marker from any map.
   */
  setMap(map) {
    if (this._map) {
      const source = _layersByMapUid[getUid(this._map)].getSource();
      source.removeFeature(this);
      if (source.isEmpty()) {
        this._map.un('pointermove', _hoverHandler);
        this._map.un('click', _clickHandler);
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
        map.on('pointermove', _hoverHandler);
        map.on('click', _clickHandler);
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
