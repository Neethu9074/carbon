import * as issueTracker from 'in-services/issueTracker';


export default class EventRenderer {

  constructor(buffer, scale, y, iconSize) {
    this.iconSize = iconSize;
    this.buffer = buffer;
    this.scale = scale;
    this.y = y;
    this.width = 0;
  }

  setWidth(width) {
    this.width = width;
  }

  drawEvents(events) {
    for (let i = 0, len = events.length; i < len; i++) {
      this.draw(events[i]);
    }
  }

  draw(event) {
    const x = this.scale.getRange(event.get('start'));
    if (x <= 0 || x > this.width) {
      return null;
    }

    this.buffer.fillStyle = issueTracker.getColorForEvent(event);
    this.buffer.globalAlpha = 0.2;
    this.buffer.fillRect(x, this.y, 1, 40);
    this.buffer.globalAlpha = 1;

    return x;
  }

  drawImage(image, x) {
    if (image) {
      this.buffer.drawImage(
        image, x - this.iconSize / 2,
        this.y + 20 - this.iconSize / 2 - 1,
        this.iconSize, this.iconSize);
      }
  }
}
