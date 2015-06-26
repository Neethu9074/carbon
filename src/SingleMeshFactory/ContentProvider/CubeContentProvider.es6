'use strict';

import ContentProvider from './ContentProvider';

/*eslint-disable no-unused-vars*/
const defaultColor = [
  0.8, 0.8, 0.8, //front
  0.9, 0.9, 0.9, //top
  1, 1, 1 //left
];
/*eslint-enable no-unused-vars*/

export default class CubeContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    super();
    this.faceColors = faceColors;
  }

  getVertices() {
    return [
      //front
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      0.5, 1, 0.5,

      -0.5, 0, 0.5,
      0.5, 1, 0.5,
      -0.5, 1, 0.5,

      //top
      -0.5, 1, 0.5,
      0.5, 1, 0.5,
      0.5, 1, -0.5,

      -0.5, 1, 0.5,
      0.5, 1, -0.5,
      -0.5, 1, -0.5,

      //left
      -0.5, 0, -0.5,
      -0.5, 0, 0.5,
      -0.5, 1, -0.5,

      -0.5, 0, 0.5,
      -0.5, 1, 0.5,
      -0.5, 1, -0.5
    ];
  }

  getColors() {
    const colors = [];
    const faceColors = this.faceColors;

    //front
    for (let i = 0; i < 18; i += 3) {
      colors[i] = faceColors[0];
      colors[i + 1] = faceColors[1];
      colors[i + 2] = faceColors[2];
    }

    //top
    for (let i = 18; i < 36; i += 3) {
      colors[i] = faceColors[3];
      colors[i + 1] = faceColors[4];
      colors[i + 2] = faceColors[5];
    }

    //left
    for (let i = 36; i < 54; i += 3) {
      colors[i] = faceColors[6];
      colors[i + 1] = faceColors[7];
      colors[i + 2] = faceColors[8];
    }

    return colors;
  }
}
