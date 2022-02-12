/* eslint-env mocha */
import should from 'should/as-function.js';
import Map from 'ol/Map.js';
import Feature from 'ol/Feature.js';
import { Style } from 'ol/style.js';
import { getUid } from 'ol/util.js';
import Point from 'ol/geom/Point.js';
import Circle from 'ol/geom/Circle.js';
import LineString from 'ol/geom/LineString.js';
import Polygon from 'ol/geom/Polygon.js';
import Marker, { _layersByMapUid } from './index.js';
import defaultStyle from './style.js';

describe('ol-marker-feature', () => {
  describe('Constructor', () => {
    it('with a location', (done) => {
      const marker = new Marker([16, 48]);
      should(marker).be.an.instanceOf(Marker);
      should(marker).be.an.instanceOf(Feature);
      should(marker.getGeometry().getCoordinates()).deepEqual([16, 48]);
      // the default style is dynamically imported, so wait until we have it
      marker.on('change', () => {
        should(marker.getStyle()).equal(defaultStyle);
        done();
      });
    });

    it('with a geometry', (done) => {
      const marker = new Marker(new Point([16, 48]));
      should(marker).be.an.instanceOf(Marker);
      should(marker).be.an.instanceOf(Feature);
      should(marker.getGeometry().getCoordinates()).deepEqual([16, 48]);
      marker.on('change', () => {
        done(new Error('Expected marker not to change'));
      });
      setTimeout(() => {
        should(marker.getStyle() instanceof Style).be.false();
        done();
      }, 100);
    });

    it('with an object', (done) => {
      const marker = new Marker({
        geometry: new Point([16, 48]),
        markup: 'Hello world!',
      });
      should(marker.getGeometry().getCoordinates()).deepEqual([16, 48]);
      should(marker.get('markup')).equal('Hello world!');
      marker.on('change', () => {
        done(new Error('Expected marker not to change'));
      });
      setTimeout(() => {
        should(marker.getStyle() instanceof Style).be.false();
        done();
      }, 100);
    });

    it('throws an error when no geometry is provided', () => {
      try {
        // eslint-disable-next-line no-new
        new Marker({ info: 'foo' });
      } catch (e) {
        should(e.message).equal('Marker must have a geometry');
      }
    });
  });

  describe('#setMap()', () => {
    let map;
    let marker;
    beforeEach(() => {
      map = new Map();
      marker = new Marker([16, 48]);
      marker.setMap(map);
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

  describe('#setStyle()', () => {
    let marker;
    beforeEach(() => {
      marker = new Marker([16, 48]);
    });

    it('sets the style', () => {
      marker.setStyle(defaultStyle);
      should(marker.getStyle() instanceof Style).be.true();
      should(marker.getStyle()).equal(defaultStyle);
    });
  });

  describe('#getLocation()', () => {
    it('returns the location for a point', () => {
      const marker = new Marker([16, 48]);
      should(marker.getLocation()).deepEqual([16, 48]);
    });

    it('returns the location for a circle', () => {
      const marker = new Marker(new Circle([16, 48], 1));
      should(marker.getLocation()).deepEqual([16, 48]);
    });

    it('returns the location for a linestring', () => {
      const marker = new Marker(new LineString([[16, 48], [17, 48]]));
      should(marker.getLocation()).deepEqual([16.5, 48]);
    });

    it('returns the location for a polygon', () => {
      const marker = new Marker(new Polygon([[[15, 47], [15, 49], [17, 49], [17, 47], [15, 47]]]));
      should(marker.getLocation()).deepEqual([16, 48]);
    });
  });
});
