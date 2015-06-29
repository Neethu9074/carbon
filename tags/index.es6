'use strict';

const tagColorCache = {};

export const getColor = (tag) => {
  if (tag in tagColorCache) {
    return tagColorCache[tag];
  }

  const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  tagColorCache[tag] = color;
  return color;
};
