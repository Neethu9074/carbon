export default class BackgroundRenderer {

  constructor(backBuffer) {
    this.backBuffer = backBuffer;
  }

  draw(width, height) {
    const buffer = this.backBuffer;

    buffer.fillStyle = '#ff0000';
    buffer.fillRect(0, 0, width, height);
  }
}
