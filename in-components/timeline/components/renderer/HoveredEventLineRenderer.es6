import { focusedMoment$ } from 'in-components/timeline/timelineStore';
import { getEventType, EVENT_TYPES } from 'in-services/issueTracker';
import { getColorByEvent } from 'in-stores/events';

export default function createHoveredEventLineRenderer(ctx, scale) {
  let highlightedEvent = null;
  let y = 0;

  let focusedMoment = null;
  const focusedMomentSubscription = focusedMoment$.subscribe(_focusedMoment => (focusedMoment = _focusedMoment));

  return {
    draw,
    setHighlightedEvent,
    dispose
  };

  function setHighlightedEvent(event) {
    highlightedEvent = event;

    if (event) {
      y = 74;
      const eventType = getEventType(event);
      if (eventType === EVENT_TYPES.INCIDENT) {
        y = 37;
      } else if (eventType === EVENT_TYPES.CHANGE) {
        highlightedEvent = null;
        y = 111;
      }
    }
  }

  function draw() {
    if (!highlightedEvent) {
      return;
    }

    const positions = {
      x: scale.getRange(highlightedEvent.get('start')),
      triggeringX: scale.getRange(highlightedEvent.get('triggeringTime', highlightedEvent.get('start')))
    };

    const from = Math.max(0, Math.min(positions.x, positions.triggeringX));
    const to = highlightedEvent.get('state') === 'open'
      ? ctx.canvas.width
      : scale.getRange(highlightedEvent.get('end'));

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = getColorByEvent({ event: highlightedEvent, focusedMoment });
    ctx.fillRect(from, y, to - from, 36);
    ctx.globalAlpha = 1;
  }

  function dispose() {
    focusedMomentSubscription.dispose();
  }
}
