/* eslint-env mocha */
import should from 'should/as-function.js';
import Map from 'ol/Map.js';
import Feature from 'ol/Feature.js';
import { Style } from 'ol/style.js';
import CircleStyle from 'ol/style/Circle.js';
import { getUid } from 'ol/util.js';
import Marker, { _layersByMapUid } from './index.js';
import defaultStyle from './style.js';

describe('ol-marker-feature', () => {
  describe('Constructor', () => {
    it('creates an instance', (done) => {
      const marker = new Marker({
        position: [16, 48],
      });
      should(marker).be.an.instanceOf(Marker);
      should(marker).be.an.instanceOf(Feature);
      should(marker.getGeometry().getCoordinates()).deepEqual([16, 48]);
      // the default style is dynamically imported, so wait until we have it
      marker.on('change', () => {
        should(marker.getStyle()).equal(defaultStyle);
        done();
      });
    });

    it('accepts options', () => {
      const style = new Style({
        image: new CircleStyle({
          radius: 5,
        }),
      });
      const marker = new Marker({
        position: [16, 48],
        markup: 'Hello world!',
        style,
      });
      should(marker.getStyle()).equal(style);
      should(marker.getMarkup()).equal('Hello world!');
    });
  });

  describe('#setMap', () => {
    let map; let
      marker;
    beforeEach(() => {
      map = new Map();
      marker = new Marker({
        position: [16, 48],
        map,
      });
    });

    it('is called when constructur is configured with `map`', () => {
      should(marker._map).equal(map);
    });

    it('creates an unmanaged layer and registers listeners', () => {
      const markerLayer = _layersByMapUid[getUid(map)];
      should(markerLayer.getSource().getFeatures()[0]).equal(marker);
      should(map.hasListener('click')).equal(true);
      should(map.hasListener('pointermove')).equal(true);
    });

    it('cleans up after marker removal', () => {
      marker.setMap(null);
      const markerLayer = _layersByMapUid[getUid(map)];
      should(markerLayer).equal(undefined);
      should(map.hasListener('click')).equal(false);
      should(map.hasListener('pointermove')).equal(false);
    });

    it('is called upon `dispose()`', () => {
      marker.dispose();
      should(marker._map).equal(null);
    });
  });

  describe('#setStyle', () => {
    let map; let marker; let
      style;
    beforeEach(() => {
      map = new Map();
      marker = new Marker({
        position: [16, 48],
        map,
      });
      style = new Style({
        image: new CircleStyle({
          radius: 5,
        }),
      });
    });

    it('sets the style', () => {
      marker.setStyle(style);
      should(marker.getStyle()).equal(style);
    });
  });

  describe('#setMarkup', () => {
    let map; let
      marker;
    beforeEach(() => {
      map = new Map();
      marker = new Marker({
        position: [16, 48],
        map,
      });
    });

    it('sets the markup', () => {
      marker.setMarkup('Hello world!');
      should(marker.getMarkup()).equal('Hello world!');
    });

    it('updates the markup on the underlying feature', () => {
      marker.setMarkup('Hello world!');
      should(marker.get('markup')).equal('Hello world!');
    });
  });

  describe('#setPosition', () => {
    let map; let
      marker;
    beforeEach(() => {
      map = new Map();
      marker = new Marker({
        position: [16, 48],
        map,
      });
    });

    it('sets the position', () => {
      marker.setPosition([16, 48]);
      should(marker.getPosition()).deepEqual([16, 48]);
    });

    it('updates the position on the underlying geometry', () => {
      marker.setPosition([16, 48]);
      should(marker.getGeometry().getCoordinates()).deepEqual([16, 48]);
    });
  });
});
