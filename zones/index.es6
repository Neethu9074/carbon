/*global window*/

'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';
import {consts} from 'instana-ui-themes';

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;
export const getZone = transformer.get;

export const getColor = (zone) => {
  let colors = window.localStorage.getItem('zone-colors');
  if (!colors) {
    colors = {};
  } else {
    colors = JSON.parse(colors);
  }

  if (zone in colors) {
    return colors[zone];
  }

  const colorIndex = Object.keys(colors).length;
  const color = consts.night.map.colors.zones[colorIndex];
  colors[zone] = color;
  window.localStorage.setItem('zone-colors', JSON.stringify(colors));
  return color;
};
