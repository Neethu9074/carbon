'use strict';

import ColorGenerator from 'instana-ui-services/util/colors';


const colorGenerator = new ColorGenerator(100);
const tagColorCache = {};

export const getColor = (tag) => {
  if (tag in tagColorCache) {
    return tagColorCache[tag];
  }

  // const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  const color = colorGenerator.getNextColor().hex;
  tagColorCache[tag] = color;
  return color;
};
