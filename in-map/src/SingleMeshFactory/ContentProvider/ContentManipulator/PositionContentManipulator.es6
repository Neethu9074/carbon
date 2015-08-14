import ContentManipulator from './ContentManipulator';


export default class PositionContentManipulator extends ContentManipulator {

  constructor({contentProvider, x=0, y=0, z=0}) {
    super({contentProvider});

    this.position = {x, y, z};
  }

  getVertices() {
    const position = this.position;
    const vertices = this.contentProvider.getVertices();

    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] += position.x;
      vertices[i + 1] += position.y;
      vertices[i + 2] += position.z;
    }
    return vertices;
  }

  getColors() {
    return this.contentProvider.getColors();
  }
}
