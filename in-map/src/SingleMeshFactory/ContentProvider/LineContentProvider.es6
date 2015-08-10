import ContentProvider from './ContentProvider';

const defaultColor = {r: 0.8, g: 0.8, b: 0.8};


export default class LineContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    super();
    this.lines = [];
    this.colors = [];

    this.setColor(faceColors);
  }

  setLines(lines) {
    this.lines = lines;
    this.updateColorArray();
  }

  setColor(color) {
    this.faceColor = [color.r, color.g, color.b];
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
