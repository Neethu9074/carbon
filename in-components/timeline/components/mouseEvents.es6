import { setHighlightedTimeframe, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import {
  setTo,
  setHighlightedEventScreenPosition,
  focusedMoment$,
  setFocusedMoment,
  isCollapsed$,
  to$,
  setTimeFrame,
  timeframe$,
  getValidWindowSize,
  fixFocusedMomentIfNotFixed
} from 'in-components/timeline/timelineStore';
import {
  setTo as setGlobalTo,
  lockFocusedMoment as lockGlobalFousedMoment,
  setHighlightedMoment,
  clearHighlightedMoment
} from 'in-stores/timeline';
import { onWheel, onMove, onDown, onUp, onLeave } from 'in-services/reactiveMouseEvents';
import { getNearestEvent, setHighlightedEvent } from 'in-stores/events';
import { eventsInTimeframe$ } from 'in-stores/eventsInTimeframe';
import { selectEvent } from 'in-services/issueTracker';
import { bigBangTimestamp$ } from 'in-stores/timeline';
import { serverTime$ } from 'in-stores/serverTime';

export default function createMouseEvents(domElement, scale, realtimeDrawStream) {
  const changeSignal = true;

  const minPixelToMoveForDragDetection = 20;

  let isFocusedMomentPanning = false;
  let xPositionOnMouseDown = null;
  let timeframeHighlightDraggingStart = null;
  let lastXPosOnPan = null;
  let isPanning = false;

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => categorizedEvents = events);

  let serverTime = Number.MAX_VALUE;
  const serverTimeSubscription = serverTime$.subscribe(time => serverTime = time);

  let bigBangTimestamp = 0;
  const bigBangTimestampSubscription = bigBangTimestamp$.subscribe(time => bigBangTimestamp = time);

  let timeframe;
  const timeframeSubscription = timeframe$.subscribe(_timeframe => timeframe = _timeframe);

  let focusedMoment;
  const focusedMomentSubscription = focusedMoment$.subscribe(fm => focusedMoment = fm);

  let isCollapsed;
  const isCollapsedSubscription = isCollapsed$.subscribe(isC => isCollapsed = isC);

  let currentTo;
  const toSubscription = to$.subscribe(_to => currentTo = _to);

  const mouseLeaveSubscription = onLeave(domElement, onMouseLeave);
  const mouseDownSubscription = onDown(domElement, onMouseDown);
  const mouseUpSubscription = onUp(domElement, onMouseUp);

  const mouseMoveSubscription = onMove(domElement, e => {
    onMouseMove(e, e.offsetX, e.clientX, e.offsetY, e.clientY);
    if (isPanning) {
      onPan(e.offsetX);
    }
  });

  const scrollSubscription = onWheel(domElement, e => {
    const oldWindowSize = scale.getDomainTo() - scale.getDomainFrom();

    // [0, 1] 0 -> left, 0.5 -> middle, 1 -> right, etc
    const normalizedMouseXPosition = e.rawEvent.offsetX / scale.getRangeTo();

    const newTimeFrame = getNewTimeframeByScroll(
      e.scrollDirection,
      e.scrollSpeed,
      oldWindowSize,
      normalizedMouseXPosition
    );

    const to = newTimeFrame.to
      ? Math.max(bigBangTimestamp + newTimeFrame.windowSize, newTimeFrame.to)
      : newTimeFrame.to;

    setTimeFrame(newTimeFrame.windowSize, to);
  });

  function getNewTimeframeByScroll(scrollDirection, scrollSpeed, oldWindowSize, normalizedMouseXPosition) {
    const newTimeFrame = {
      windowSize: oldWindowSize,
      to: currentTo
    };

    const step = 0.05 * scrollSpeed;
    const newWindowSize = getValidWindowSize(
      scrollDirection < 0 ? oldWindowSize * (1 - step) : oldWindowSize * (1 + step)
    );

    newTimeFrame.windowSize = newWindowSize;

    const deltaWindowSizes = oldWindowSize - newWindowSize;
    newTimeFrame.to -= deltaWindowSizes * (1 - normalizedMouseXPosition);
    newTimeFrame.to = Math.max(0, newTimeFrame.to);

    if (newTimeFrame.to >= serverTime) {
      // Only keep live when currently live. Clamp to servertime otherwise
      if (timeframe.to == null) {
        newTimeFrame.to = null;
      } else {
        newTimeFrame.to = serverTime;
      }
    } else {
      // lock the global focused moment if the timeframe was limited to the past
      // multi locking is checked by lockGlobalFousedMoment implementation
      lockGlobalFousedMoment();
    }

    return newTimeFrame;
  }

  return {
    // export this method to make it testable
    getNewTimeframeByScroll,

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

    if (!e.shiftKey) {
      timeframeHighlightDraggingStart = scale.getDomain(e.offsetX);
      return;
    }

    clearHighlightedTimeframe();
  }

  function onMouseUp(e) {
    const movedSinceMouseDown = Math.abs(e.offsetX - xPositionOnMouseDown);
    if (movedSinceMouseDown <= minPixelToMoveForDragDetection) {
      onClick(e);
    }

    xPositionOnMouseDown = null;
    timeframeHighlightDraggingStart = null;
    onPanEnd();
  }

  function onMouseLeave() {
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    clearHighlightedMoment();

    timeframeHighlightDraggingStart = null;
    xPositionOnMouseDown = null;

    if (isPanning) {
      onPanEnd();
    }
  }

  function onMouseMove(e, x, screenX, y) {
    // if the distance of the cursor
    if (!isPanning && xPositionOnMouseDown && e.shiftKey) {
      const movedSinceMouseDown = Math.abs(x - xPositionOnMouseDown);
      if (movedSinceMouseDown > minPixelToMoveForDragDetection) {
        onPanStart(x);
      }
    }

    setHighlightedMoment(scale.getDomain(x));

    // don't try to calculate mouseover if the user is panning or there are no events
    if (isPanning || !categorizedEvents) {
      return;
    }

    const eventAtCursor = getEventAtXY(x, y);

    // add a hand cursor to support UX and tell the user that he can interact with the domElement at this point
    if (eventAtCursor) {
      domElement.style.cursor = 'pointer';
    } else {
      domElement.style.cursor = 'auto';
    }

    setHighlightedEvent(eventAtCursor);
    setHighlightedEventScreenPosition(
      eventAtCursor
        ? {
            x: screenX,
            y: isCollapsed ? 140 : resultDependingOnY(y, 60, 100, 140)
          }
        : null
    );

    realtimeDrawStream.emit(changeSignal);

    if (timeframeHighlightDraggingStart) {
      setHighlightedTimeframe(timeframeHighlightDraggingStart, scale.getDomain(x));
    }
  }

  function onPanStart(x) {
    // if the user has an active mouseover state, clear it
    setHighlightedEventScreenPosition(null);
    setHighlightedEvent(null);

    // set focued moment to the right edge if the user panned away from servertime
    // otherwhise set it to null, so return to livemode again
    fixFocusedMomentIfNotFixed();

    isPanning = true;
    lastXPosOnPan = x;
  }

  function onPan(x) {
    const pixelPanned = lastXPosOnPan - x;

    if (isFocusedMomentPanning) {
      const newTimestamp = Math.max(
        bigBangTimestamp, // minimum is the big bang time
        Math.min(
          serverTime, // maximum is servertime
          // because it's not allowed to scroll to future times
          scale.getDomain(lastXPosOnPan + pixelPanned)
        )
      );
      setFocusedMoment(newTimestamp);
    } else {
      domElement.style.cursor = 'ew-resize';

      const newTimestamp = Math.max(
        bigBangTimestamp + timeframe.windowSize,
        Math.min(serverTime, scale.getDomain(scale.getRangeTo() + pixelPanned))
      );
      setTo(newTimestamp);
    }

    lastXPosOnPan = x;
  }

  function onPanEnd() {
    if (isPanning && !isFocusedMomentPanning && !focusedMoment) {
      const timeToSet = scale.getDomainTo();
      // if the user pans to the right border (servertime) set to live mode again
      setGlobalTo(Math.min(timeToSet, serverTime));
    }

    isFocusedMomentPanning = false;
    isPanning = false;

    realtimeDrawStream.emit(changeSignal);

    domElement.style.cursor = 'auto';
  }

  function getEventAtXY(x, y) {
    if (!categorizedEvents) {
      return null;
    }

    const eventsToCheck = resultDependingOnY(
      y,
      categorizedEvents.incidents,
      categorizedEvents.issues,
      categorizedEvents.changes
    );

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
    bigBangTimestampSubscription.dispose();
    focusedMomentSubscription.dispose();
    isCollapsedSubscription.dispose();
    serverTimeSubscription.dispose();
    mouseLeaveSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    timeframeSubscription.dispose();
    mouseUpSubscription.dispose();
    eventsSubscription.dispose();
    scrollSubscription.dispose();
    toSubscription.dispose();
  }
}
