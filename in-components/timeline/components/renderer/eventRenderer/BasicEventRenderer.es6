import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker/issueTracker';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {focusedMoment$} from 'in-components/timeline/timelineStore';
import {selectedEvent$, selectedEventId$} from 'in-stores/events';
import {isEventOpenAtFocusedMoment} from 'in-stores/events';
import {getColorForEvent} from 'in-services/issueTracker';
import {selectedSnapshotId} from 'in-stores/snapshot';
import {emptyArray} from 'in-services/fixedObjects';


const highlightedColor = '#ffffff';

export default class EventRenderer extends BasicRenderer {

  constructor(backBuffer, scale, y, iconSize) {
    super(backBuffer, scale);

    this.highlightedEvent = null;
    this.iconSize = iconSize;
    this.width = 0;
    this.y = y;

    this.selectedEvent = null;
    this.recentEventIds = emptyArray;

    this.selectedIncidentSubscription = selectedEvent$.subscribe(_event => {
      if (!_event || getEventType(_event) !== EVENT_TYPES.INCIDENT) {
        this.recentEventIds = emptyArray;
        this.selectedEvent = null;
        return;
      }

      this.selectedEvent = _event;
      this.recentEventIds = _event.get('recentEvents', emptyArray).toArray();

      // add the incident itself to highlight it, too
      this.recentEventIds.push(_event.get('id'));
    });

    this.focusedMoment = null;
    this.focusedMomentSubscription = focusedMoment$.subscribe(_focusedMoment => this.focusedMoment = _focusedMoment);

    this.highlightedEntityId = null;
    this.highlightedEntityIdSubscription = highlightedEntityId$.subscribe(id => this.highlightedEntityId = id);

    this.selectedSnapshotId = null;
    this.selectedSnapshotIdSubscription = selectedSnapshotId.subscribe(id => this.selectedSnapshotId = id);

    this.selectedEventId = null;
    this.selectedEventIdSubscription = selectedEventId$.subscribe(id => this.selectedEventId = id);
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
        this.backBuffer.globalAlpha = 0.2;
        this.draw(event, event === this.highlightedEvent);
        this.backBuffer.globalAlpha = 1;
      } else {
        this.draw(event, event === this.highlightedEvent);
      }
    }
  }

  isEventActive(event) {
    const snapshotId = event.getIn(['problem', 'snapshotId']);
    // the event is active (which means that it will be drawn normally) if there is no incident selected
    // and the events range must cross the focused moment so it currentyl active
    // and it has to contain to cetrain selected entityId (if available)
    if (!this.selectedEvent &&
       (!this.focusedMoment || event.get('start') <= this.focusedMoment) &&
       (!this.highlightedEntityId || snapshotId === this.highlightedEntityId) &&
       (!this.selectedSnapshotId || snapshotId === this.selectedSnapshotId)) {
      return true;
    }

    // otherwhise we have to look if the event is inside the recent events of the selected incident
    return this.recentEventIds.indexOf(event.get('id')) < 0 ? false : true;
  }

  eventIsOpenAtFocusedMoment(event) {
    return isEventOpenAtFocusedMoment(event.get('start'), event.get('end'), event.get('state'), this.focusedMoment);
  }

  eventIsOpenOnLiveMode(event) {
    return event.get('state') === 'open';
  }

  draw(event, isHighlighted) {
    const scale = this.scale;
    const x = scale.getRange(event.get('start'));
    if (x <= 0 || x > this.width) {
      return null;
    }

    const buffer = this.backBuffer;
    buffer.fillStyle = isHighlighted ? highlightedColor : getColorForEvent(event);

    const prevValue = buffer.globalAlpha;
    buffer.globalAlpha = 0.2;
    buffer.fillRect(x, this.y, 1, 36);

    if (event.get('id') === this.selectedEventId) {
      const to = event.get('state') === 'open' ?
        this.backBuffer.canvas.width :
        scale.getRange(event.get('end'));

      buffer.fillRect(x, this.y, to - x, 36);
    }

    buffer.globalAlpha = prevValue;

    return x;
  }

  drawImage(image, x) {
    if (image) {
      const iconSize = this.iconSize;

      this.backBuffer.drawImage(
        image, x - iconSize / 2,        // x
        this.y + 20 - iconSize / 2 - 1, // y
        iconSize,                       // width
        iconSize);                      // height
      }
  }

  dispose() {
    super.dispose();

    this.highlightedEntityIdSubscription.dispose();
    this.selectedSnapshotIdSubscription.dispose();
    this.selectedIncidentSubscription.dispose();
    this.selectedEventIdSubscription.dispose();
    this.focusedMomentSubscription.dispose();
  }
}
