import ContentManipulator from './ContentManipulator';


export default class ColorMultiplierContentManipulator extends ContentManipulator {

  constructor({contentProvider, r = 1, g = 1, b = 1}) {
    super({contentProvider});

    this.color = {r, g, b};
  }

  getVertices() {
    return this.contentProvider.getVertices();
  }

  getColors() {
    const color = this.color;
    const colors = this.contentProvider.getColors();

    for (let i = 0; i < colors.length; i += 3) {
      colors[i] *= color.r;
      colors[i + 1] *= color.g;
      colors[i + 2] *= color.b;
    }

    return colors;
  }
}
