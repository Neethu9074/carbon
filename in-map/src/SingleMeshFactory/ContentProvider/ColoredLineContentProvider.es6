import ContentProvider from './ContentProvider';


const DEFAULT_COLOR = [1, 1, 1]; // white color as default

export default class ColoredLineContentProvider extends ContentProvider {

  constructor(faceColors = DEFAULT_COLOR) {
    super();

    this.lines = [];
    this.colors = faceColors.slice();
  }

  setLines(lines) {
    this.lines = lines;
  }

  setColor(colors) {
    this.colors = colors;
  }

  getVertices() {
    return this.lines;
  }

  getColors() {
    return this.colors;
  }
}
