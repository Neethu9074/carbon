import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';

export default class BackgroundRenderer extends BasicRenderer {
  constructor(backBuffer, scale, height) {
    super(backBuffer, scale);

    this.height = height;
    this.width = 0;
  }

  setWidth(width) {
    this.width = width;
  }

  draw() {
    const buffer = this.backBuffer;
    const width = this.width;

    // fill whole canvas with color of lines
    buffer.fillStyle = '#43565E';
    buffer.fillRect(0, 0, width, this.height);

    // fill the rest of the canvas with the actual background color
    buffer.fillStyle = '#2D4048';
    buffer.fillRect(0, 0, width, 36);
    buffer.fillRect(0, 37, width, 36);
    buffer.fillRect(0, 74, width, 36);
    buffer.fillRect(0, 111, width, 36);
  }
}
