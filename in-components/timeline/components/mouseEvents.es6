import * as ro from 'reactive-observables';

import {setTo, setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$, getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {setCursor, CURSOR_TYPES} from 'in-stores/cursorStore';
import {selectEvent} from 'in-services/issueTracker';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  let millisBetweenMouseDownAndUp = Number.MAX_VALUE;
  const maxMillisForClickDetection = 300;

  const changeSignal = true;
  let isDragging = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  const mouseDownSubscription = ro.on(canvas, 'mousedown').subscribe(onMouseDown);
  const mouseUpSubscription = ro.on(canvas, 'mouseup').subscribe(onMouseUp);

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

  function onClick(e) {
    const eventAtCursor = getEventAtXY(e.offsetX, e.offsetY);
    if (eventAtCursor) {
      selectEvent(eventAtCursor);
    }
  }

  function onMouseDown() {
    isDragging = true;
    millisBetweenMouseDownAndUp = Date.now();
  }

  function onMouseUp(e) {
    isDragging = false;

    millisBetweenMouseDownAndUp = Date.now() - millisBetweenMouseDownAndUp;
    if (millisBetweenMouseDownAndUp < maxMillisForClickDetection) {
      onClick(e);
    }
  }

  function onMouseMove(x, screenX, y) {
    if (!categorizedEvents) {
      return;
    }

    const eventAtCursor = getEventAtXY(x, y);

    setCursor(eventAtCursor ? CURSOR_TYPES.POINTER : CURSOR_TYPES.DEFAULT);

    setHighlightedEvent(eventAtCursor);
    setHighlightedEventScreenPosition(eventAtCursor ? {
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

  function getEventAtXY(x, y) {
    const eventsToCheck = resultDependingOnY(y,
      categorizedEvents.incidents,
      categorizedEvents.issues,
      categorizedEvents.changes);
    if (!eventsToCheck) {
      return null;
    }

    const pixelsToCheckForEventMouseOver = 20;
    const timeAtCursor = scale.getDomain(x);
    const timeFrom = scale.getDomain(x - pixelsToCheckForEventMouseOver / 2);
    const maxDistance = Math.abs(timeAtCursor - timeFrom);

    return getNearestEvent(eventsToCheck, scale.getDomain(x), maxDistance);
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
