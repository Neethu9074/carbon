import ColorGenerator from 'in-services/util/ColorGenerator';

import {nameOfUndefinedZone} from 'in-forge/constants';

import pbst from '../util/pluginBasedSnapshotTransformation';

const colorGenerator = new ColorGenerator(20);
const zoneColorCache = {};

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;

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
