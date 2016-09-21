import {setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import {recentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import {getNearestEvent, setHighlightedEvent} from 'in-stores/events';
import {setHighlightedMoment} from 'in-stores/timeline';
import {onMove} from 'in-services/reactiveMouseEvents';


export default function createMouseEvents(canvas, scale, realtimeDrawStream) {
  const changeSignal = true;

  let events;
  const eventsSubscription = recentEvents$.subscribe(_events => events = _events);

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

  function getEventAtXY(x) {
    if (!events) {
      return null;
    }

    const pixelsToCheckForEventMouseOver = 20;
    const timeAtCursor = scale.getDomain(x);
    const timeFrom = scale.getDomain(x - pixelsToCheckForEventMouseOver / 2);
    const maxDistance = Math.abs(timeAtCursor - timeFrom);

    return getNearestEvent(events, scale.getDomain(x), maxDistance);
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
