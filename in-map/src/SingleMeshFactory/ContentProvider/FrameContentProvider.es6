

import ContentProvider from './ContentProvider';

/*eslint-disable no-unused-vars*/
const defaultColor = [
  0.8, 0.8, 0.8, //front
  0.9, 0.9, 0.9, //top
  1, 1, 1 //left
];
/*eslint-enable no-unused-vars*/

export default class FrameContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    super();
    this.faceColors = faceColors;
  }

  getVertices() {
    return [
      -0.5, 0, -0.5,
      0.5, 0, -0.5,

      0.5, 0, -0.5,
      0.5, 0, 0.5,

      0.5, 0, 0.5,
      -0.5, 0, 0.5,

      -0.5, 0, 0.5,
      -0.5, 0, -0.5
    ];
  }

  getColors() {
    return defaultColor;
  }
}
