import { Style, Icon } from 'ol/style.js';

/**
 * Marker from `assets/marker.png` converted to data URI
 */
const marker = 'data:image/png;base64,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';

export default new Style({
  image: new Icon({
    src: marker,
    size: [82, 82],
    scale: 0.5,
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    anchor: [25, 82],
  }),
});