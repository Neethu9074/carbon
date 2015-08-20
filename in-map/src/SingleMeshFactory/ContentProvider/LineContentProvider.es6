import ContentProvider from './ContentProvider';


const defaultColor = [1, 1, 1]; // white color as default

export default class LineContentProvider extends ContentProvider {

  constructor(faceColors = defaultColor) {
    super();

    this.lines = [];
    this.colors = [];

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
    const colors = [];
    let colorIndex = 0;

    this.lines.forEach(() => {
      colors.push(faceColors[colorIndex++]);
      if(colorIndex >= faceColors.length) {
        colorIndex = 0;
      }
    });
    this.colors = colors;
  }

  getVertices() {
    return this.lines;
  }

  getColors() {
    return this.colors;
  }
}
