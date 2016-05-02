const darkColor = '#2e4048';
const midColor = '#43565e';

export default class BackgroundRenderer {

  constructor(buffer, height) {
    this.buffer = buffer;

    this.height = height;
    this.width = 0;
  }

  setWidth(width) {
    this.width = width;
  }

  draw() {
    const buffer = this.buffer;

    buffer.fillStyle = darkColor;
    buffer.fillRect(0, 0, this.width, this.height);

    buffer.fillStyle = midColor;
    buffer.fillRect(0, 40, this.width, 40);
    buffer.fillRect(0, 81, this.width, 40);
    buffer.fillRect(0, 122, this.width, 40);
  }
}
