import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import { getEventType, EVENT_TYPES } from 'in-services/issueTracker/issueTracker';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { focusedMoment$ } from 'in-components/timeline/timelineStore';
import { selectedEvent$, selectedEventId$ } from 'in-stores/events';
import { isEventOpenAtFocusedMoment } from 'in-stores/events';
import { getColorForEvent } from 'in-services/issueTracker';
import { selectedSnapshotId } from 'in-stores/snapshot';
import { emptyArray } from 'in-services/fixedObjects';

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
    if (
      !this.selectedEvent &&
      (!this.focusedMoment || this.getEventStart(event) <= this.focusedMoment) &&
      (!this.highlightedEntityId || snapshotId === this.highlightedEntityId) &&
      (!this.selectedSnapshotId || snapshotId === this.selectedSnapshotId)
    ) {
      return true;
    }

    // otherwhise we have to look if the event is inside the recent events of the selected incident
    return this.recentEventIds.indexOf(event.get('id')) < 0 ? false : true;
  }

  eventIsOpen(event) {
    return isEventOpenAtFocusedMoment(
      this.getEventStart(event),
      event.get('end'),
      event.get('state'),
      this.focusedMoment
    );
  }

  draw(event, isHighlighted) {
    const scale = this.scale;
    const positions = {
      x: scale.getRange(event.get('start')),
      triggeringX: scale.getRange(this.getEventStart(event))
    };

    this.drawSelectedEventTimerange(event, positions);

    if (positions.x <= 0 || positions.x > this.width) {
      if (positions.triggeringX <= 0 || positions.triggeringX > this.width) {
        return null;
      }
    }

    this.backBuffer.fillStyle = isHighlighted ? highlightedColor : getColorForEvent(event);

    const prevValue = this.backBuffer.globalAlpha;
    this.backBuffer.globalAlpha = 0.2;
    this.backBuffer.fillRect(positions.triggeringX, this.y, 1, 36);
    this.backBuffer.globalAlpha = prevValue;

    return positions;
  }

  drawSelectedEventTimerange(event, positions) {
    if (event.get('id') !== this.selectedEventId) {
      return;
    }

    const prevValue = this.backBuffer.globalAlpha;
    const from = Math.max(0, Math.min(positions.x, positions.triggeringX));
    const to = event.get('state') === 'open' ? this.backBuffer.canvas.width : this.scale.getRange(event.get('end'));

    this.backBuffer.globalAlpha = 0.2;
    this.backBuffer.fillStyle = highlightedColor;
    this.backBuffer.fillRect(from, this.y, to - from, 36);
    this.backBuffer.globalAlpha = prevValue;
  }

  drawImage(image, x) {
    if (image) {
      const iconSize = this.iconSize;

      this.backBuffer.drawImage(
        image,
        x - iconSize / 2, // x
        this.y + 20 - iconSize / 2 - 1, // y
        iconSize, // width
        iconSize
      ); // height
    }
  }

  getEventStart(event) {
    return event.get('triggeringTime', event.get('start'));
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
