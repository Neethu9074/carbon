import {focusedMoment$} from 'in-components/timeline/timelineStore';
import {getColorForEventAtFocusedMoment} from 'in-stores/events';
import * as issueTracker from 'in-services/issueTracker';


export default class HoveredEventLineRenderer {

  constructor(buffer, scale) {
    this.highlightedEvent = null;
    this.buffer = buffer;
    this.scale = scale;
    this.y = 0;

    this.focusedMoment = null;
    this.focusedMomentSubscription = focusedMoment$.subscribe(focusedMoment => this.focusedMoment = focusedMoment);
  }

  setHighlightedEvent(event) {
    this.highlightedEvent = event;

    if (event) {
      this.y = 81;
      const eventType = issueTracker.getEventType(event);
      if (eventType === issueTracker.EVENT_TYPES.INCIDENT) {
        this.y = 40;
      } else if (eventType === issueTracker.EVENT_TYPES.CHANGE) {
        this.y = 122;
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

    const to = event.get('state') === 'open' ?
      this.scale.getRange(this.scale.getDomainTo()) :
      this.scale.getRange(event.get('end'));

    console.log(event.toJS(), this.focusedMoment, getColorForEventAtFocusedMoment(event, this.focusedMoment));

    this.buffer.globalAlpha = 0.2;
    this.buffer.fillStyle = getColorForEventAtFocusedMoment(event, this.focusedMoment);
    this.buffer.fillRect(x, this.y, to - x, 40);
    this.buffer.globalAlpha = 1;
  }

  dispose() {
    this.focusedMomentSubscription.dispose();
  }
}
