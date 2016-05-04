import * as ro from 'reactive-observables';

import {setTo, setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$, getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {setCursor, CURSOR_TYPES} from 'in-stores/cursorStore';
import {selectEvent} from 'in-services/issueTracker';
import {setTimeframe} from 'in-stores/timeline';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  let millisBetweenMouseDownAndUp = Number.MAX_VALUE;
  const minPixelToMoveForDragDetection = 5;
  const maxMillisForClickDetection = 300;

  const changeSignal = true;

  let xPositionOnMouseDown = null;
  let isPanning = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  const mouseDownSubscription = ro.on(canvas, 'mousedown').subscribe(onMouseDown);
  const mouseUpSubscription = ro.on(canvas, 'mouseup').subscribe(onMouseUp);

  const mouseLeaveSubscription = ro.on(canvas, 'mouseleave').subscribe(() => {
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    if (isPanning) {
      onPanEnd();
    }
  });

  const mouseMoveSubscription = ro.on(canvas, 'mousemove')
    .throttle(100)
    .subscribe(e => {
      onMouseMove(e.offsetX, e.x, e.offsetY, e.y);
      if (isPanning) {
        onPan(e.offsetX, e.offsetX - e.movementX);
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

  function onMouseDown(e) {
    xPositionOnMouseDown = e.offsetX;
    millisBetweenMouseDownAndUp = Date.now();
  }

  function onMouseUp(e) {
    xPositionOnMouseDown = null;
    onPanEnd();

    millisBetweenMouseDownAndUp = Date.now() - millisBetweenMouseDownAndUp;
    if (millisBetweenMouseDownAndUp < maxMillisForClickDetection) {
      onClick(e);
    }
  }

  function onMouseMove(x, screenX, y) {
    if (!isPanning && xPositionOnMouseDown) {
      const movedSinceMouseDown = Math.abs(x - xPositionOnMouseDown);
      if (movedSinceMouseDown > minPixelToMoveForDragDetection) {
        onPanStart();
      }
    }

    // don't try to calculate mouseover if the user is dragging or there are no events
    if (isPanning || !categorizedEvents) {
      return;
    }

    const eventAtCursor = getEventAtXY(x, y);

    // add a hand cursor to support UX and tell the user that he can interact with the canvas at this point
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

  function onPanStart() {
    // if the user has an active mouseover state, clear it
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    isPanning = true;

    /*
      TODO: begin dragging
    */
  }

  function onPanEnd() {
    isPanning = false;

    /*
      TODO: stop dragging

    */
    // setTimeframe();
  }

  function onPan(x, prevX) {
    setCursor(CURSOR_TYPES.HORIZONTAL_MOVE); // add visual scroll effect to support UX

    /*
      TODO: on dragging
    */
    const oldTimestamp = scale.getDomain(prevX);
    const newTimestamp = scale.getDomain(x);
    // setTo(newTimestamp, oldTimestamp);


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
