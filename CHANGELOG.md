# Changelog

## v2.0.2

* Fixes in Usage example

## v2.0.1

* Minor documentation improvements

## v2.0.0

This release is less opinionated, and makes the `ol/Feature` wrapper even thinner.

### Breaking changes

#### Simpler constructor

To create a marker at latitude 48° and longitude 16°, now simply use `new Marker([16, 48])`. With this constructor signature, the marker will be configured with the ol-marker-feature default style.

The constructor now also supports the same signatures as [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html). When these signatures are used, no default style will be set, and the marker will be rendered with the OpenLayers default style. To set a custom style, use
```js
import Point from 'ol/geom/Point';

const marker = new Marker(new Point([16, 48]));
marker.setStyle(myStyle);
```

To set ol-marker-feature's default style for a point, use
```js
import defaultStyle from 'ol-marker-feature/style';
marker.setStyle(defaultStyle);
```

if you previously created a marker with
```js
const marker = new Marker({
  position: [16, 48],
  markup: 'I am a marker.'
  map: myMap,
});
```
change it to
```js
const marker = new Marker([16, 48]);
marker.set('markup', 'I am a marker.');
marker.setMap(myMap);
```

#### Removal of the `getMarkup()` and `setMarkup()` methods

Use `marker.get('markup')` and `marker.set('markup', 'my markup')` instead.

#### Removal of the `setPosition()` method

Use `marker.getGeometry().setCoordinates()` instead.

#### `getPosition()` method renamed to `getLocation()`

Instead of `marker.getPosition()`, use `marker.getLocation()`.

### New features

#### Support for `Circle`, `LineString` and `Polygon` geometries

ol-marker-feature now supports more geometry types than just `Point`.

## v1.0.4

* Fix README markdown

## v1.0.3

* Remove `ol-popup` dependency
* Add .npmignore

## v1.0.2

* Added `@classdesc`

## v1.0.1

* Fixed `main` field in `package.json`
