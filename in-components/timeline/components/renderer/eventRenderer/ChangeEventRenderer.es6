import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import {getColorForEvent} from 'in-services/issueTracker';


export default class ChangeEventRenderer extends BasicEventRenderer {

  constructor(backBuffer, scale, iconSize, yOffset = 111) {
    super(backBuffer, scale, yOffset, iconSize);
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
