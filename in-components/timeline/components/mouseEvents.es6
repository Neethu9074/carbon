import * as ro from 'reactive-observables';

import {setTo, setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$, getNearestEvent, setHighlightedEvent} from 'in-stores/events';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  const changeSignal = true;
  let isDragging = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  const mouseUpSubscription = ro.on(canvas, 'mouseup').subscribe(() => isDragging = false);
  const mouseDownSubscription = ro.on(canvas, 'mousedown').subscribe(() => isDragging = true);

  const mouseLeaveSubscription = ro.on(canvas, 'mouseleave').subscribe(() => {
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);
    isDragging = false;
  });

  const mouseMoveSubscription = ro.on(canvas, 'mousemove')
    .throttle(100)
    .subscribe(e => {
      onMouseMove(e.offsetX, e.x, e.offsetY, e.y);
      if (isDragging) {
        onDrag(e.offsetX, e.offsetX - e.movementX);
      }
  });

  return {
    dispose
  };

  function onMouseMove(x, screenX, y) {
    if (!categorizedEvents) {
      return;
    }

    const eventsToCheck = resultDependingOnY(y,
      categorizedEvents.incidents,
      categorizedEvents.issues,
      categorizedEvents.changes);
    if (!eventsToCheck) {
      return;
    }

    const pixelsToCheckForEventMouseOver = 20;
    const timeAtCursor = scale.getDomain(x);
    const timeFrom = scale.getDomain(x - pixelsToCheckForEventMouseOver / 2);
    const maxDistance = Math.abs(timeAtCursor - timeFrom);

    const hit = getNearestEvent(eventsToCheck, scale.getDomain(x), maxDistance);
    setHighlightedEvent(hit);
    setHighlightedEventScreenPosition(hit ? {
      x: screenX,
      y: resultDependingOnY(y,
        60, // if incidents
        100, // if issues
        140 // if changes
      )
    } : null);
  }

  function onDrag(x, prevX) {
    const oldTimestamp = scale.getDomain(prevX);
    const newTimestamp = scale.getDomain(x);
    setTo(newTimestamp, oldTimestamp);

    realtimeDrawStream.emit(changeSignal);
  }

  function resultDependingOnY(y, incidentResult, issueResult, changesResult) {
    if (y >= 40 && y <= 80) {
      return incidentResult;
    } else if (y >= 81 && y <= 120) {
      return issueResult;
    } else if (y >= 121 && y <= 160) {
      return changesResult;
    }
  }

  function dispose() {
    mouseLeaveSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    mouseUpSubscription.dispose();
    eventsSubscription.dispose();
  }
}
