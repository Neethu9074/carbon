import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {darkColor, midColor} from 'in-components/timeline/timelineConfig';


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

    buffer.fillStyle = darkColor;
    buffer.fillRect(0, 0, width, this.height);

    buffer.fillStyle = midColor;
    buffer.fillRect(0, 40, width, 40);
    buffer.fillRect(0, 81, width, 40);
    buffer.fillRect(0, 122, width, 40);
  }
}
