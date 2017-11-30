import { hexToRGBNormalized } from 'in-services/formatters/color';
import { Color } from 'in-map/3DLibProvider';

const colorService = new Color(0, 0, 0);

export default class ColorGenerator {
  constructor(desiredNumberOfColors) {
    this.desiredNumberOfColors = desiredNumberOfColors;
    this.progress = 0;
    this.colorIndex = 0;
    this.stepsPerGenerate = 1 / desiredNumberOfColors;

    this.setHueRange(25, 360);
    this.setSatRange(85, 100);
    this.setLumRange(70, 90);

    const colors = [];
    for (let i = 0; i < desiredNumberOfColors; i++) {
      colors.push(this.createColor());
    }
    this.colors = this.reOrder(colors);
  }

  setHueRange(min, max) {
    this.minHue = Math.max(0, min);
    this.maxHue = Math.min(max, 360);
  }

  setSatRange(min, max) {
    this.minSat = Math.max(0, min);
    this.maxSat = Math.min(max, 100);
  }

  setLumRange(min, max) {
    this.minLum = Math.max(0, min);
    this.maxLum = Math.min(max, 100);
  }

  reOrder(array) {
    const resultArray = [array[0]]; // add first
    this.addRange(array, resultArray, 0, array.length - 1);
    resultArray.push(array[array.length - 1]); // add last

    const final = [];
    const middle = Math.ceil(resultArray.length / 2);
    for (let i = 0; i < middle; i++) {
      final.push(resultArray[i]);
      final.push(resultArray[i + middle]);
    }

    return final;
  }

  addRange(fromArray, toArray, fromIndex, toIndex) {
    const middle = getMiddle(fromIndex, toIndex);
    if (middle === -1) {
      return;
    }

    toArray.push(fromArray[middle]);
    this.addRange(fromArray, toArray, fromIndex, middle);
    this.addRange(fromArray, toArray, middle, toIndex);
  }

  createColor() {
    const h = this.minHue + (this.maxHue - this.minHue) * this.progress;
    const s = this.minSat + (this.maxSat - this.minSat) * this.progress;
    const l = this.minLum + (this.maxLum - this.minLum) * this.progress;

    this.progress += this.stepsPerGenerate;
    if (this.progress > 1) {
      this.progress = 0;
    }

    colorService.setHSL(h / 360, s / 100, l / 100);
    const hex = '#' + colorService.getHexString();

    return {
      h,
      s,
      l,
      hex
    };
  }

  getNextColor() {
    const color = this.colors[this.colorIndex++];

    if (this.colorIndex > this.colors.length - 1) {
      this.colorIndex = 0;
    }

    return color;
  }
}

export const colorPools = {};

export function getColorPool(nameOfPool) {
  if (!colorPools[nameOfPool]) {
    createColorPool(nameOfPool);
  }
  return colorPools[nameOfPool];
}

export function createColorPool(nameOfPool, numColors = 10) {
  const colorGenerator = new ColorGenerator(numColors);
  const tagColorCache = {};

  const getColor = tag => {
    if (tag in tagColorCache) {
      return tagColorCache[tag];
    }

    // const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    const color = colorGenerator.getNextColor().hex;
    tagColorCache[tag] = color;
    return color;
  };

  colorPools[nameOfPool] = {
    getColorHex: getColor,
    getColorRGB: tag => hexToRGBNormalized(getColor(tag))
  };

  return colorPools[nameOfPool];
}

// create default color pools
export const processesColorPool = createColorPool('processes', 100);
export const groupsColorPool = createColorPool('groups', 20);
export const tagsColorPool = createColorPool('tags', 100);

function getMiddle(from, to) {
  const index = Math.floor((from + to) / 2);
  if (index === from || index === to) {
    return -1;
  }

  return index;
}
