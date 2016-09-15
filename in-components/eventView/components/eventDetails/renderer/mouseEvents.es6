import {setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {events$} from 'in-components/eventView/stores/eventsStore';
import {setHighlightedMoment} from 'in-stores/timeline';
import {onMove} from 'in-services/reactiveMouseEvents';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  const changeSignal = true;

  let categorizedEvents;
  const eventsSubscription = events$.subscribe(events => categorizedEvents = events);

  const mouseMoveSubscription = onMove(canvas, e => {
    onMouseMove(e.offsetX, e.x, e.offsetY, e.y);
  });

  function onMouseMove(x, screenX, y) {
    setHighlightedMoment(scale.getDomain(x));
    const eventAtCursor = getEventAtXY(x, y);

    setHighlightedEvent(eventAtCursor);
    setHighlightedEventScreenPosition(eventAtCursor ? {
      x: screenX,
      y: resultDependingOnY(y, 60, 100, 140)
    } : null);

    realtimeDrawStream.emit(changeSignal);
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
      return issueResult;
    } else if (y >= 81 && y <= 120) {
      return changesResult;
    }
  }

  return {
    dispose
  };

  function dispose() {
    mouseMoveSubscription.dispose();
    eventsSubscription.dispose();
  }
}
