

import ContentProvider from './ContentProvider';

/*eslint-disable no-unused-vars*/
const defaultColor = [1, 1, 1];
/*eslint-enable no-unused-vars*/

export default class PlaneContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    super();
    this.faceColors = faceColors;
  }

  getVertices() {
    return [
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      0.5, 0, -0.5,

      -0.5, 0, 0.5,
      0.5, 0, -0.5,
      -0.5, 0, -0.5];
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

    return colors;
  }
}
