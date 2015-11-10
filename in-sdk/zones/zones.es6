import ColorGenerator from 'in-services/util/ColorGenerator';

import pbst from '../util/pluginBasedSnapshotTransformation';

const nameOfUndefinedZone = 'undefined zone';
const colorGenerator = new ColorGenerator(20);
const zoneColorCache = {};

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;
export const getZone = function getZone(snapshot) {
  if (snapshot == null) return nameOfUndefinedZone;

  const zone = transformer.get(snapshot);
  if (zone !== undefined) {
    return zone;
  }
  return nameOfUndefinedZone;
};

export const getColor = (zone) => {
  if (zone === nameOfUndefinedZone) {
    return '#808080';
  }

  if (zone in zoneColorCache) {
    return zoneColorCache[zone];
  }

  const color = colorGenerator.getNextColor().hex;
  zoneColorCache[zone] = color;
  return color;
};
