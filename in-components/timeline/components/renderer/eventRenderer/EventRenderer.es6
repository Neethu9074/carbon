import * as issueTracker from 'in-services/issueTracker';


const white = '#f0f000';

export default class EventRenderer {

  constructor(buffer, scale, y, iconSize) {
    this.highlightedEvent = null;
    this.iconSize = iconSize;
    this.buffer = buffer;
    this.scale = scale;
    this.width = 0;
    this.y = y;
  }

  setWidth(width) {
    this.width = width;
  }

  setHighlightedEvent(event) {
    this.highlightedEvent = event;
  }

  drawEvents(events) {
    for (let i = 0, len = events.length; i < len; i++) {
      const event = events[i];
      this.draw(event, event === this.highlightedEvent);
    }
  }

  draw(event, isHighlighted) {
    const x = this.scale.getRange(event.get('start'));
    if (x <= 0 || x > this.width) {
      return null;
    }

    this.buffer.fillStyle = isHighlighted ? white : issueTracker.getColorForEvent(event);
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
