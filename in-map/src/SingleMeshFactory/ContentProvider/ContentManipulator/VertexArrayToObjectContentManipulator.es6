import ContentManipulator from './ContentManipulator';


export default class VertexArrayToObjectContentManipulator
  extends ContentManipulator {

  constructor({contentProvider}) {
    super({contentProvider});
  }

  getVertices() {
    const transformed = [];
    const vertices = this.contentProvider.getVertices();
    for (let i = 0; i < vertices.length; i += 3) {
      transformed.push({
        x: vertices[i],
        y: vertices[i + 1],
        z: vertices[i + 2]
      });
    }
    return transformed;
  }

  getColors() {
    return this.contentProvider.getColors();
  }
}
