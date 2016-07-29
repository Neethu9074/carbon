import THREE from 'three';

import {theme} from 'in-services/theme';

import ContentProvider from './ContentProvider';


const DEFAULT_COLOR = (() => {
  const colors = [];
  const converter = new THREE.Color();

  fillIn(colors, converter, theme.chart.strokeColors[0]);
  fillIn(colors, converter, theme.chart.strokeColors[1]);
  fillIn(colors, converter, theme.chart.strokeColors[2]);
  fillIn(colors, converter, theme.chart.strokeColors[3]);
  fillIn(colors, converter, theme.chart.strokeColors[4]);

  return colors;
})();

function fillIn(colors, converter, hex) {
  converter.set(hex);
  colors.push([
    converter.r, converter.g, converter.b,
    converter.r - 0.1, converter.g - 0.1, converter.b - 0.1,
    converter.r - 0.2, converter.g - 0.2, converter.b - 0.2
  ]);
}

export default class SlicedCubeContentProvider extends ContentProvider {

  constructor({numSlices = 1}) {
    super();

    this.numSlices = numSlices;
    this.faceColors = DEFAULT_COLOR;

    this.calculateSliceIndices();
    this.calculatePositions();
    this.calculateColors();
  }

  calculateColors() {
    const faceColors = this.faceColors;
    let indexInColors = 0;
    const colors = [];
    let offset = 0;

    for (let iSlice = 0; iSlice < this.numSlices; iSlice++) {
      const colorArray = faceColors[indexInColors++];
      if (indexInColors >= faceColors.length) {
        indexInColors = 0;
      }

      // front
      for (let i = 0; i < 18; i += 3) {
        colors[i + offset] = colorArray[0];
        colors[i + offset + 1] = colorArray[1];
        colors[i + offset + 2] = colorArray[2];
      }

      // top
      for (let i = 18; i < 36; i += 3) {
        colors[i + offset] = colorArray[3];
        colors[i + offset + 1] = colorArray[4];
        colors[i + offset + 2] = colorArray[5];
      }

      // left
      for (let i = 36; i < 54; i += 3) {
        colors[i + offset] = colorArray[6];
        colors[i + offset + 1] = colorArray[7];
        colors[i + offset + 2] = colorArray[8];
      }
      offset += 54;
    }
    this.cachedColors = colors;
  }

  calculatePositions() {
    const totalHeight = 1;
    const heightPerSlice = totalHeight / this.numSlices;

    let vertices = [];
    for (let i = 0; i < this.numSlices; i++) {
      const from = i * heightPerSlice;
      const to = (i + 1) * heightPerSlice;
      const slice = [
        // front
        -0.5, from, 0.5,
        0.5, from, 0.5,
        0.5, to, 0.5,

        -0.5, from, 0.5,
        0.5, to, 0.5,
        -0.5, to, 0.5,

        // top
        -0.5, to, 0.5,
        0.5, to, 0.5,
        0.5, to, -0.5,

        -0.5, to, 0.5,
        0.5, to, -0.5,
        -0.5, to, -0.5,

        // left
        -0.5, from, -0.5,
        -0.5, from, 0.5,
        -0.5, to, -0.5,

        -0.5, from, 0.5,
        -0.5, to, 0.5,
        -0.5, to, -0.5
      ];
      vertices = vertices.concat(slice);
    }
    this.cachedVertices = vertices;
  }

  calculateSliceIndices() {
    let indices = [];

    for (let i = 0; i < this.numSlices; i++) {
      const slice = [
        // front
        i,
        i,
        i + 1,

        i,
        i + 1,
        i + 1,

        // top
        i + 1,
        i + 1,
        i + 1,

        i + 1,
        i + 1,
        i + 1,

        // left
        i,
        i,
        i + 1,

        i,
        i + 1,
        i + 1
      ];
      indices = indices.concat(slice);
    }

    this.cachedIndices = indices;
  }

  getVertices() {
    return this.cachedVertices.slice();
  }

  getColors() {
    return this.cachedColors.slice();
  }

  getSliceIndices() {
    return this.cachedIndices.slice();
  }
}
