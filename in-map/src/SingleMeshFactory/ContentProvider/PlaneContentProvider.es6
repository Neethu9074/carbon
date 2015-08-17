import ContentProvider from './ContentProvider';

const defaultColor = [1, 1, 1];

export default class PlaneContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    super();
    this.faceColors = faceColors;

    const colors = [];
    for (let i = 0; i < 18; i += 3) {
      colors[i] = faceColors[0];
      colors[i + 1] = faceColors[1];
      colors[i + 2] = faceColors[2];
    }
    this.colors = colors;
  }

  getVertices() {
    return [
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      0.5, 0, -0.5,

      -0.5, 0, 0.5,
      0.5, 0, -0.5,
      -0.5, 0, -0.5
    ];
  }

  getColors() {
    return this.colors.slice();
  }
}
