# OpenLayers Marker Feature

This plugin provides an easy way to add markers to an OpenLayers map and associate them with popups, e.g. using [ol-popup](https://npmjs.com/package/ol-popup).

A `Marker` is basically an [`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html). When it is added to a map, the plugin will create an unmanaged layer for the map's markers. It will also set up `pointermove` and `click` listeners to change the cursor when the user hovers over a marker, and to dispatch a `click` event on the `Marker` when it is clicked.

## Usage

    npm install ol-marker-feature

Once you have installed the plugin, you can import and use it:

```js
import Marker from 'ol-marker-feature';
import Popup from 'ol-popup';

const marker = new Marker([16.351, 48.277]);
marker.set('info', 'I am a marker.')
marker.setMap(map);

const popup = new Popup({offset: [0, -32]});
map.addOverlay(popup);

marker.on('click', function() {
  popup.show(marker.getPosition(), marker.get('info'));
});
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [constructor](#constructor)
    *   [Parameters](#parameters)
*   [getLocation](#getlocation)
*   [setMap](#setmap)
    *   [Parameters](#parameters-1)
*   [dispose](#dispose)
*   [geometry](#geometry)
*   [style](#style)

### constructor

`import Marker from 'ol-marker-feature';`

This plugin provides an easy way to add markers to an OpenLayers map and associate them with
popups, e.g. using [ol-popup](https://npmjs.com/package/ol-popup).

A `Marker` is basically an
[`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html). When it
is added to a map, the plugin will create an unmanaged layer for the map's marker features. It
will also set up `pointermove` and `click` listeners to change the cursor when the user hovers
over a marker, and to dispatch a `click` event on the `Marker` when it is clicked.

Fires

*   `click` when the marker is clicked.

#### Parameters

*   `coordOrGeomOrOptions` **(ol_coordinate_Coordinate | ol_geom_Geometry | objectWithGeometry)** Coordinates of a point marker, a geometry, or an object with a `geometry` property. When only
    coordinates are provided  (e.g. `new Marker([16, 48])`), a marker with the
    [default style](#style) is created.

### getLocation

Get the location of the marker feature. For points, this will be the point itself.
For other geometry types, it will be a point on the geometry. Use this method e.g. for
displaying a popup at the marker feature's location.

Returns **ol_coordinate_Coordinate** Location of the marker in view coordinates.

### setMap

Adds the marker to the specified map.

#### Parameters

*   `map` **(ol_Map | null)** Map to add the marker to. Call with `null` to
    remove the marker from any map.

### dispose

Clean up when this marker is no longer needed.

### geometry

### style

`import style from 'ol-marker-feature/style';`

Default style for markers. A blue placemark icon with a shadow, 41x41 pixels, with the anchor at
the tip of the marker (\[12.5, 41] in pixel coordinates). When used with
[ol-popup](https://npmjs.com/package/ol-popup), the recommended
[`offset`](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html) for the popup
is `[0, -32]`. For use in custom styles, the icon is included in this package and can be
imported from `ol-markup-feature/assets/marker.png`.

Type: ol_style_Style

## Developing

To develop locally, the examples are useful. A development server is available with

    npm run examples

When it is running, you can access the examples that are available in the `examples/` folder, by browsing e.g. to https://localhost:3000/marker.html.
