import ColorGenerator from 'in-services/util/ColorGenerator';

const colorGenerator = new ColorGenerator(20);
const zoneColorCache = {};

export const getColor = (zone) => {
  if (zone in zoneColorCache) {
    return zoneColorCache[zone];
  }

  const color = colorGenerator.getNextColor().hex;
  zoneColorCache[zone] = color;
  return color;
};
