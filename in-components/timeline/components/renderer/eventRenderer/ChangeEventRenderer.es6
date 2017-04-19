import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import { getColorByEvent } from 'in-stores/events';

export default class ChangeEventRenderer extends BasicEventRenderer {
  constructor(backBuffer, scale, iconSize, yOffset = 111) {
    super(backBuffer, scale, yOffset, iconSize);
  }

  draw(event, isHighlighted) {
    const positions = super.draw(event, isHighlighted);
    if (!positions) {
      return;
    }

    this.backBuffer.fillStyle = getColorByEvent(event);
    this.backBuffer.fillRect(positions.x, this.y + 10, 2, 18);
  }
}
