import {theme} from 'in-services/theme';

import ContentProvider from './ContentProvider';

const defaultColor = (() => {
  const cubeColorFalloffValues = theme.map.colors.cubeColorFalloffValues;
  const right = cubeColorFalloffValues.right;
  const top = cubeColorFalloffValues.top;

  return [
    right.r, right.g, right.b,
    top.r, top.g, top.b,
    1, 1, 1
  ];
})();


export default class CubeContentProvider extends ContentProvider {

  constructor(faceColors = defaultColor) {
    super();

    const colors = [];

    // front
    for (let i = 0; i < 18; i += 3) {
      colors[i] = faceColors[0];
      colors[i + 1] = faceColors[1];
      colors[i + 2] = faceColors[2];
    }

    // top
    for (let i = 18; i < 36; i += 3) {
      colors[i] = faceColors[3];
      colors[i + 1] = faceColors[4];
      colors[i + 2] = faceColors[5];
    }

    // left
    for (let i = 36; i < 54; i += 3) {
      colors[i] = faceColors[6];
      colors[i + 1] = faceColors[7];
      colors[i + 2] = faceColors[8];
    }

    this.cachedColors = colors;
  }

  getVertices() {
    return [
      // front
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      0.5, 1, 0.5,

      -0.5, 0, 0.5,
      0.5, 1, 0.5,
      -0.5, 1, 0.5,

      // top
      -0.5, 1, 0.5,
      0.5, 1, 0.5,
      0.5, 1, -0.5,

      -0.5, 1, 0.5,
      0.5, 1, -0.5,
      -0.5, 1, -0.5,

      // left
      -0.5, 0, -0.5,
      -0.5, 0, 0.5,
      -0.5, 1, -0.5,

      -0.5, 0, 0.5,
      -0.5, 1, 0.5,
      -0.5, 1, -0.5
    ];
  }

  getColors() {
    return this.cachedColors.slice();
  }
}
