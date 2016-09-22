import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import {recentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {emptyArray} from 'in-services/fixedObjects';


export default function createEventsRenderer(screenBuffer, scale) {
  const changesRenderer = new ChangeEventRenderer(screenBuffer, scale, 14, 74);
  const issuesRenderer = new IssueRenderer(screenBuffer, scale, 14, 37);

  let events = emptyArray;
  const eventsSubscription = recentEvents$.subscribe(_events => events = _events);


  function setWidth(width) {
    changesRenderer.setWidth(width);
    issuesRenderer.setWidth(width);
  }

  function setHighlightedEvent(event) {
    changesRenderer.setHighlightedEvent(event);
    issuesRenderer.setHighlightedEvent(event);
  }

  function draw() {
    if (!events) {
      return;
    }

    changesRenderer.drawEvents(events.filter(event => getEventType(event) === EVENT_TYPES.CHANGE));
    issuesRenderer.drawEvents(events.filter(event => {
      const type = getEventType(event);
      return (type === EVENT_TYPES.ISSUE_OK ||
              type === EVENT_TYPES.ISSUE_WARNING ||
              type === EVENT_TYPES.ISSUE_CRITICAL);
    }));
  }

  return {
    draw,
    setWidth,
    setHighlightedEvent,
    dispose
  };

  function dispose() {
    eventsSubscription.dispose();

    changesRenderer.dispose();
    issuesRenderer.dispose();
  }
}
