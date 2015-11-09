import ColorGenerator from 'in-services/util/ColorGenerator';

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
