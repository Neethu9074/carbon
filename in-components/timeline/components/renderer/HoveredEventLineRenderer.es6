import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import { focusedMoment$ } from 'in-components/timeline/timelineStore';
import { getEventType, EVENT_TYPES } from 'in-services/issueTracker';
import { getColorForEventAtFocusedMoment } from 'in-stores/events';

export default class HoveredEventLineRenderer extends BasicRenderer {
  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.highlightedEvent = null;
    this.y = 0;

    this.focusedMoment = null;
    this.focusedMomentSubscription = focusedMoment$.subscribe(focusedMoment => this.focusedMoment = focusedMoment);
  }

  setHighlightedEvent(event) {
    this.highlightedEvent = event;

    if (event) {
      this.y = 74;
      const eventType = getEventType(event);
      if (eventType === EVENT_TYPES.INCIDENT) {
        this.y = 37;
      } else if (eventType === EVENT_TYPES.CHANGE) {
        this.y = 111;
      }
    }
  }

  draw() {
    const event = this.highlightedEvent;
    if (!event) {
      return;
    }

    const x = this.scale.getRange(event.get('start'));
    if (x <= 0 || x > this.width) {
      return;
    }

    const to = event.get('state') === 'open' ? this.backBuffer.canvas.width : this.scale.getRange(event.get('end'));

    const buffer = this.backBuffer;
    buffer.globalAlpha = 0.2;
    buffer.fillStyle = getColorForEventAtFocusedMoment(event, this.focusedMoment);
    buffer.fillRect(x, this.y, to - x, 36);
    buffer.globalAlpha = 1;
  }

  dispose() {
    super.dispose();

    this.focusedMomentSubscription.dispose();
  }
}
