const darkColor = '#2e4048';
const midColor = '#43565e';

export default class BackgroundRenderer {

  constructor(buffer) {
    this.buffer = buffer;
  }

  draw(width, height) {
    const buffer = this.buffer;

    buffer.fillStyle = darkColor;
    buffer.fillRect(0, 0, width, height);

    buffer.fillStyle = midColor;
    buffer.fillRect(0, 40, width, 40);
    buffer.fillRect(0, 81, width, 40);
    buffer.fillRect(0, 122, width, 40);
  }
}
