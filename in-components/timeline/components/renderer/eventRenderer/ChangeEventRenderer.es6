import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import {getColorForEvent} from 'in-services/issueTracker';


export default class ChangeEventRenderer extends BasicEventRenderer {

  constructor(backBuffer, scale, iconSize) {
    super(backBuffer, scale, 111, iconSize);
  }

  draw(event, isHighlighted) {
    const x = super.draw(event, isHighlighted);
    if (!x) {
      return;
    }

    this.backBuffer.fillStyle = getColorForEvent(event);
    this.backBuffer.fillRect(x, this.y + 10, 2, 18);
  }
}
