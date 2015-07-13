'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';
import {consts} from 'instana-ui-themes';

const zoneColorCache = {};

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;
export const getZone = transformer.get;

export const getColor = (zone) => {
  if (zone in zoneColorCache) {
    return zoneColorCache[zone];
  }

  const colorIndex = Object.keys(zoneColorCache).length;
  const color = consts.night.map.colors.zones[colorIndex];
  zoneColorCache[zone] = color;
  return color;
};
