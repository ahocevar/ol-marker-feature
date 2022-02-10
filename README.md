# OpenLayers Marker Feature

This plugin provides an easy way to add markers to an OpenLayers map and associate them with popups, e.g. using [ol-popup](https://npmjs.com/package/ol-popup).

A `Marker` is basically an [`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html). When it is added to a map, the plugin will create an unmanaged layer for the map's markers. It will also set up `pointermove` and `click` listeners to change the cursor when the user hovers over a marker, and to dispatch a `click` event on the `Marker` when it is clicked.

## Usage

    npm install ol-marker-feature

Once you have installed the plugin, you can import and use it:

```js
import Marker from 'ol-marker-feature';
import Popup from 'ol-popup';

const marker = new Marker({
  position: [16.351, 48.277],
  markup: 'I am a marker.',
  map: map
});

const popup = new Popup({offset: [0, -32]});
map.addOverlay(popup);

marker.on('click', function() {
  popup.show(marker.getPosition(), marker.getMarkup());
});
```

## API

### Marker

`import default from 'ol-marker-feature';`

Extends: [`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html)

The documentation below does not list any inherited properties and methods. Please consult the [`ol/Feature`](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) docs to see them.

#### Constructor

`new Marker(options`: [`MarkerOptions`](#interface-markeroptions)`)`: [`Marker`](#marker)

Creates a new marker.

#### Event: click

Fired when the user clicks on the marker.

#### Method: dispose

`marker.dispose()`

Clean up when the marker is no longer needed.

#### Method: getMarkup

`marker.getMarkup()`: `string`

Get the markup for this marker.

#### Method: getPosition

`marker.getPosition()`: [`Coordinate`](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate)

Get the position of the marker.

#### Method: setMap

`marker.setMap(map`: [`Map`](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)`|null)`

Adds the marker to the specified map. Call with `null` to remove the marker from any map.

#### Method: setMarkup

`marker.setMarkup(markup`: `string)`

Set the markup for this marker. Can be used e.g. as popup content.

#### Method: setPosition

`marker.setPosition(position`: [`Coordinate`](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate)`)`

Set the position of the marker.

#### Interface: MarkerOptions

* `position`: [`Coordinate`](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate) - Position of the marker in view coordinates.
* `markup`: [`string`] - Info markup associated with the marker. Can be used e.g. as popup content.
* `style`: [[`Style`](https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html)] - Style for the marker. The default style is a blue icon with a shadow, 41x41 pixels, with the anchor at the tip of the marker ([12.5, 41] in pixel coordinates). When used with [ol-popup](https://npmjs.com/package/ol-popup), the recommended [`offset`](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html) for the popup is `[0, -32]`. For use in custom styles, the icon is included in this package and can be imported from `ol-markup-feature/assets/marker.png`.
* `map`: [[`Map`](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)] - Map to add the marker to.

## Developing

To develop locally, the examples are useful. A development server is available with

    npm run examples

When it is running, you can access the examples that are available in the `examples/` folder, by browsing e.g. to https://localhost:3000/marker.html.
