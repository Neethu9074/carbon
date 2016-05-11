import {
  setTo,
  setHighlightedEventScreenPosition,
  focusedMomentXPosition$,
  focusedMoment$,
  setFocusedMoment,
  setTimeFrame,
  isCollapsed$
} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$, getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {onWheel, onMove, onDown, onUp, onLeave} from 'in-services/reactiveMouseEvents';
import {setCursor, CURSOR_TYPES} from 'in-stores/cursorStore';
import {setTo as setGlobalTo} from 'in-stores/timeline';
import {selectEvent} from 'in-services/issueTracker';
import {serverTime$} from 'in-stores/serverTime';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  const changeSignal = true;

  const minPixelToMoveForDragDetection = 5;

  const minZoomLevel = 1000 * 60 * 10; // 10 min
  const maxZoomLevel = 1000 * 60 * 60 * 24 * 30; // 1 month (30 days)

  let xPositionOnMouseDown = null;
  let lastXPosOnPan = null;
  let isPanning = false;
  let isFocusedMomentPanning = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  let serverTime = Number.MAX_VALUE;
  const serverTimeSubscription = serverTime$.subscribe(time => serverTime = time);

  let focusedMomentXPosition;
  const focusedMomentXPositionSubscription = focusedMomentXPosition$.subscribe(newX => focusedMomentXPosition = newX);

  let focusedMoment;
  const focusedMomentSubscription = focusedMoment$.subscribe(fm => focusedMoment = fm);

  let isCollapsed;
  const isCollapsedSubscription = isCollapsed$.subscribe(isC => isCollapsed = isC);

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
    const step = 0.05 * e.scrollSpeed;
    const newWindowSize = e.deltaY < 0 ? oldWindowSize * (1 - step) : oldWindowSize * (1 + step);
    setTimeFrame(Math.max(minZoomLevel, Math.min(maxZoomLevel, newWindowSize)));
  });

  return {
    dispose
  };

  function onClick(e) {
    const eventAtCursor = getEventAtXY(e.offsetX, e.offsetY);
    if (eventAtCursor) {
      selectEvent(eventAtCursor);
    } else {
      // if there is no event and the user clicked, set the focused moment to the time at pixel clicked
      setFocusedMoment(scale.getDomain(e.offsetX));
    }
  }

  function onMouseDown(e) {
    xPositionOnMouseDown = e.offsetX;

    // if the distance of the cursor
    if (isCursorOnFocusedMoment(e.offsetX, e.offsetY)) {
      isFocusedMomentPanning = true;
    }
  }

  function onMouseUp(e) {
    const movedSinceMouseDown = Math.abs(e.offsetX - xPositionOnMouseDown);
    if (movedSinceMouseDown <= minPixelToMoveForDragDetection) {
      onClick(e);
    }

    xPositionOnMouseDown = null;
    isFocusedMomentPanning = false;
    onPanEnd();
  }

  function onMouseMove(x, screenX, y) {
    // if the distance of the cursor
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
    setCursor(eventAtCursor || isCursorOnFocusedMoment(x, y) ? CURSOR_TYPES.POINTER : CURSOR_TYPES.DEFAULT);

    setHighlightedEvent(eventAtCursor);
    setHighlightedEventScreenPosition(eventAtCursor ? {
      x: screenX,
      y: isCollapsed ? 140 : resultDependingOnY(y, 60, 100, 140)
    } : null);

    realtimeDrawStream.emit(changeSignal);
  }

  function onPanStart(x) {
    // if the user has an active mouseover state, clear it
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    isPanning = true;
    lastXPosOnPan = x;
  }

  function onPan(x) {
    const pixelPanned = lastXPosOnPan - x;

    if (isFocusedMomentPanning) {
      // min, because it's not allowed to scroll to future times
      const newTimestamp = Math.max(0, Math.min(serverTime, scale.getDomain(lastXPosOnPan + pixelPanned)));
      setFocusedMoment(newTimestamp);

    } else {
      setCursor(CURSOR_TYPES.HORIZONTAL_MOVE); // add visual scroll effect to support UX

      // min, because it's not allowed to scroll to future times
      const newTimestamp = Math.min(serverTime, scale.getDomain(scale.getRangeTo() + pixelPanned));
      setTo(newTimestamp);
    }

    lastXPosOnPan = x;
  }

  function onPanEnd() {
    if (!isFocusedMomentPanning && !focusedMoment) {
      const timeToSet = scale.getDomainTo();
      // if the user panns to the right border (servertime) set to live mode again
      setGlobalTo(timeToSet >= serverTime ? null : timeToSet);
    }

    isFocusedMomentPanning = false;
    isPanning = false;

    realtimeDrawStream.emit(changeSignal);

    setCursor(CURSOR_TYPES.DEFAULT);
  }

  function getEventAtXY(x, y) {
    if (!categorizedEvents) {
      return null;
    }

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

  function isCursorOnFocusedMoment(x, y) {
    return y < 50 && Math.abs(focusedMomentXPosition - x) <= 4 ? true : false;
  }

  function dispose() {
    focusedMomentXPositionSubscription.dispose();
    focusedMomentSubscription.dispose();
    isCollapsedSubscription.dispose();
    serverTimeSubscription.dispose();
    mouseLeaveSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    mouseUpSubscription.dispose();
    eventsSubscription.dispose();
    scrollSubscription.dispose();
  }
}
