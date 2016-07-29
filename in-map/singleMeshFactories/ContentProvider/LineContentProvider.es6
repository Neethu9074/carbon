import ContentProvider from './ContentProvider';


const DEFAULT_COLOR = [1, 1, 1]; // white color as default

export default class LineContentProvider extends ContentProvider {

  constructor(faceColors = DEFAULT_COLOR) {
    super();

    this.lines = [];
    this.colors = [];
    this.opacity = 1;

    this.faceColor = faceColors.slice();
  }

  setLines(lines) {
    this.lines = lines;
    this.updateColorArray();
  }

  setColor(color) {
    const faceColor = this.faceColor;
    faceColor[0] = color.r;
    faceColor[1] = color.g;
    faceColor[2] = color.b;

    this.updateColorArray();
  }

  updateColorArray() {
    const faceColors = this.faceColor;

    for (let i = 0; i < this.lines.length; i += 3) {
      this.colors[i] = faceColors[0];
      this.colors[i + 1] = faceColors[1];
      this.colors[i + 2] = faceColors[2];
    }
  }

  getVertices() {
    return this.lines;
  }

  getColors() {
    return this.colors;
  }
}
