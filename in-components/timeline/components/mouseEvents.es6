import {setTo, setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {setTo as setGlobalTo, setTimeframe as setGlobalTimeframe} from 'in-stores/timeline';
import {eventsInTimeframe$, getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {onWheel, onMove, onDown, onUp, onLeave} from 'in-services/reactiveMouseEvents';
import {setCursor, CURSOR_TYPES} from 'in-stores/cursorStore';
import {selectEvent} from 'in-services/issueTracker';
import {serverTime$} from 'in-stores/serverTime';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  const changeSignal = true;

  let millisBetweenMouseDownAndUp = Number.MAX_VALUE;
  const minPixelToMoveForDragDetection = 5;
  const maxMillisForClickDetection = 300;

  let xPositionOnMouseDown = null;
  let lastXPosOnPan = null;
  let isPanning = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  let serverTime = Number.MAX_VALUE;
  const serverTimeSubscription = serverTime$.subscribe(time => serverTime = time);

  const mouseDownSubscription = onDown(canvas, onMouseDown);
  const mouseUpSubscription = onUp(canvas, onMouseUp);

  const mouseLeaveSubscription = onLeave(canvas, () => {
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    xPositionOnMouseDown = null;

    if (isPanning) {
      onPanEnd();
    }
  });

  const mouseMoveSubscription = onMove(canvas, e => {
    onMouseMove(e.offsetX, e.x, e.offsetY, e.y);
    if (isPanning) {
      onPan(e.offsetX);
    }
  });

  const scrollSubscription = onWheel(canvas, e => {
    const oldWindowSize = scale.getDomainTo() - scale.getDomainFrom();
    const step = 0.01;
    const newWindowSize = e.sign < 0 ? oldWindowSize * (1 - step) : oldWindowSize * (1 + step);
    setGlobalTimeframe(newWindowSize);
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
        onPanStart(x);
      }
    }

    // don't try to calculate mouseover if the user is panning or there are no events
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

  function onPanStart(x) {
    // if the user has an active mouseover state, clear it
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    isPanning = true;
    lastXPosOnPan = x;
  }

  function onPan(x) {
    setCursor(CURSOR_TYPES.HORIZONTAL_MOVE); // add visual scroll effect to support UX

    const pixelPanned = lastXPosOnPan - x;

    // min, because it's not allowed to scroll to future times
    const newTimestamp = Math.min(serverTime, scale.getDomain(scale.getRangeTo() + pixelPanned));
    setTo(newTimestamp);

    lastXPosOnPan = x;
  }

  function onPanEnd() {
    isPanning = false;
    setGlobalTo(scale.getDomainTo());

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
    serverTimeSubscription.dispose();
    mouseLeaveSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    mouseUpSubscription.dispose();
    eventsSubscription.dispose();
    scrollSubscription.dispose();
  }
}
