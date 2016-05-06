import * as issueTracker from 'in-services/issueTracker';
import {selectedIncident} from 'in-stores/incident';
import {emptyArray} from 'in-services/fixedObjects';


const highlightedColor = '#ffffff';

export default class EventRenderer {

  constructor(buffer, scale, y, iconSize) {
    this.highlightedEvent = null;
    this.iconSize = iconSize;
    this.buffer = buffer;
    this.scale = scale;
    this.width = 0;
    this.y = y;

    this.selectedIncident = null;
    this.recentEventIds = emptyArray;

    this.selectedIncidentSubscription = selectedIncident.subscribe(si => {
      this.selectedIncident = si;
      if (si) {
        this.recentEventIds = si.get('recentEvents').toArray();
        this.recentEventIds.push(si.get('id'));
      } else {
        this.recentEventIds = emptyArray;
      }
    });
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
      if (!this.isEventActive(event)) {
        this.buffer.globalAlpha = 0.2;
        this.draw(event, event === this.highlightedEvent);
        this.buffer.globalAlpha = 1;
      } else {
        this.draw(event, event === this.highlightedEvent);
      }
    }
  }

  isEventActive(event) {
    // the event is active (which means that it will be drawn normally) if there is no incident selected
    if (!this.selectedIncident) {
      return true;
    }

    // otherwhise we have to look if the event is inside the recent events of the selected incident
    return this.recentEventIds.indexOf(event.get('id')) < 0 ? false : true;
  }

  draw(event, isHighlighted) {
    const x = this.scale.getRange(event.get('start'));
    if (x <= 0 || x > this.width) {
      return null;
    }

    this.buffer.fillStyle = isHighlighted ? highlightedColor : issueTracker.getColorForEvent(event);

    const prevValue = this.buffer.globalAlpha;
    this.buffer.globalAlpha = 0.2;
    this.buffer.fillRect(x, this.y, 1, 40);
    this.buffer.globalAlpha = prevValue;

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

  dispose() {
    this.selectedIncidentSubscription.dispose();
  }
}
