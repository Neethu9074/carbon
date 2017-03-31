export default class BasicRenderer {
  constructor(backBuffer, scale) {
    this.backBuffer = backBuffer;
    this.scale = scale;
  }

  draw() {
    throw new Error('OVERRIDE THIS');
  }

  dispose() {
    this.backBuffer = null;
    this.scale = null;
  }
}
