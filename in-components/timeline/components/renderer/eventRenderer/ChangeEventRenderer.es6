import EventRenderer from 'in-components/timeline/components/renderer/eventRenderer/EventRenderer';
import * as issueTracker from 'in-services/issueTracker';


export default class ChangeEventRenderer extends EventRenderer {

  constructor(buffer, scale, iconSize) {
    super(buffer, scale, 122, iconSize);
  }

  draw(event) {
    const x = super.draw(event);
    if (!x) {
      return;
    }

    this.buffer.fillStyle = issueTracker.getColorForEvent(event);
    this.buffer.fillRect(x, this.y + 10, 2, 18);
  }
}
