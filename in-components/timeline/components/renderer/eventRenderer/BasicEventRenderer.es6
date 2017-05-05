import { getEventType, EVENT_TYPES, getColorByEvent, selectedEvent$, selectedEventId$ } from 'in-stores/events';
import { selectedSnapshotId as selectedSnapshotId$ } from 'in-stores/snapshot';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { focusedMoment$ } from 'in-components/timeline/timelineStore';
import { isEventOpenAtFocusedMoment } from 'in-stores/events';
import { emptyArray } from 'in-services/fixedObjects';

const highlightedColor = '#ffffff';

export default function createEventRenderer(ctx, scale) {
  let recentEventIds = emptyArray;
  let highlightedEvent = null;
  let selectedEvent = null;
  let width = 0;

  const selectedIncidentSubscription = selectedEvent$.subscribe(_event => {
    if (!_event || getEventType(_event) !== EVENT_TYPES.INCIDENT) {
      recentEventIds = emptyArray;
      selectedEvent = null;
      return;
    }

    selectedEvent = _event;
    recentEventIds = _event.get('recentEvents', emptyArray).toArray();

    // add the incident itself to highlight it, too
    recentEventIds.push(_event.get('id'));
  });

  let focusedMoment = null;
  const focusedMomentSubscription = focusedMoment$.subscribe(_focusedMoment => (focusedMoment = _focusedMoment));

  let highlightedEntityId = null;
  const highlightedEntityIdSubscription = highlightedEntityId$.subscribe(_id => (highlightedEntityId = _id));

  let selectedSnapshotId = null;
  const selectedSnapshotIdSubscription = selectedSnapshotId$.subscribe(_id => (selectedSnapshotId = _id));

  let selectedEventId = null;
  const selectedEventIdSubscription = selectedEventId$.subscribe(_id => (selectedEventId = _id));

  return {
    draw,
    drawImage,
    drawEvents,
    eventIsOpen,
    isEventActive,
    setWidth,
    setHighlightedEvent,
    dispose
  };

  function setWidth(_width) {
    width = _width;
  }

  function setHighlightedEvent(event) {
    highlightedEvent = event;
  }

  function drawEvents(events, renderer) {
    for (let i = 0, len = events.length; i < len; i++) {
      const event = events[i];
      if (isEventActive(event)) {
        renderer.draw(event, event === highlightedEvent);
      } else {
        ctx.globalAlpha = 0.2;
        renderer.draw(event, event === highlightedEvent);
        ctx.globalAlpha = 1;
      }
    }
  }

  function isEventActive(event) {
    // the event is active (which means that it will be drawn normally) if there is no incident selected
    // and the events range must cross the focused moment so it currentyl active
    // and it has to contain to cetrain selected entityId (if available)
    if (!selectedEvent && (!focusedMoment || getEventStart(event) <= focusedMoment)) {
      const snapshotId = event.getIn(['problem', 'snapshotId']);
      if (
        (!highlightedEntityId || snapshotId === highlightedEntityId) &&
        (!selectedSnapshotId || snapshotId === selectedSnapshotId)
      ) {
        return true;
      }
    }

    // otherwhise we have to look if the event is inside the recent events of the selected incident
    return recentEventIds.indexOf(event.get('id')) < 0 ? false : true;
  }

  function eventIsOpen(event) {
    return isEventOpenAtFocusedMoment(getEventStart(event), event.get('end'), event.get('state'), focusedMoment);
  }

  function draw(event, isHighlighted, y) {
    const drawConfig = {
      x: scale.getRange(event.get('start')),
      triggeringX: scale.getRange(getEventStart(event))
    };

    drawSelectedEventTimerange(event, drawConfig, y);

    if (drawConfig.x <= 0 || drawConfig.x > width) {
      if (drawConfig.triggeringX <= 0 || drawConfig.triggeringX > width) {
        return null;
      }
    }

    ctx.fillStyle = isHighlighted ? highlightedColor : getColorByEvent({ event });

    const prevValue = ctx.globalAlpha;
    ctx.globalAlpha = 0.2;
    ctx.fillRect(drawConfig.triggeringX, y, 1, 36);
    ctx.globalAlpha = prevValue;

    return drawConfig;
  }

  function drawSelectedEventTimerange(event, positions, y) {
    if (event.get('id') !== selectedEventId) {
      return;
    }

    const from = Math.max(0, Math.min(positions.x, positions.triggeringX));
    const to = event.get('state') === 'open' ? width : scale.getRange(event.get('end'));

    const prevValue = ctx.globalAlpha;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = highlightedColor;
    ctx.fillRect(from, y, to - from, 36);
    ctx.globalAlpha = prevValue;
  }

  function drawImage(image, x, y, iconSize) {
    ctx.drawImage(
      image,
      x - iconSize / 2, // x
      y + 20 - iconSize / 2 - 1, // y
      iconSize, // width
      iconSize // height
    );
  }

  function getEventStart(event) {
    return event.get('triggeringTime', event.get('start'));
  }

  function dispose() {
    highlightedEntityIdSubscription.dispose();
    selectedSnapshotIdSubscription.dispose();
    selectedIncidentSubscription.dispose();
    selectedEventIdSubscription.dispose();
    focusedMomentSubscription.dispose();
  }
}
