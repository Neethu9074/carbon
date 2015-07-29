'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';
import ColorGenerator from 'in-services/util/colors';
// import {consts} from 'in-themes';

const colorGenerator = new ColorGenerator(20);
const zoneColorCache = {};

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;
export const getZone = transformer.get;

export const getColor = (zone) => {
  if (zone in zoneColorCache) {
    return zoneColorCache[zone];
  }

  // const colorIndex = Object.keys(zoneColorCache).length;
  // const color = consts.night.map.colors.zones[colorIndex];

  const color = colorGenerator.getNextColor().hex;
  zoneColorCache[zone] = color;
  return color;
};
