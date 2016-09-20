import {combineLatest} from 'reactive-observables';

import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {alwaysNull} from 'in-services/fixedStreams';
import {emptyArray} from 'in-services/fixedObjects';
import {selectedEventId$} from 'in-stores/events';
import {getEvent} from 'in-services/issueTracker';


export default function createEventsRenderer(screenBuffer, scale) {
  const changesRenderer = new ChangeEventRenderer(screenBuffer, scale, 14, 74);
  const issuesRenderer = new IssueRenderer(screenBuffer, scale, 14, 37);

  let events = emptyArray;
  const eventsSubscription = selectedEventId$.flatMap(id => id ? getEvent(id) : alwaysNull)
                                             .flatMap(event => {
                                                const recentEvents = event
                                                  ? event.get('recentEvents')
                                                  : null;

                                               return recentEvents
                                                 ? combineLatest(recentEvents.toArray().map(id => getEvent(id)))
                                                 : alwaysNull;
                                             })
                                             .subscribe(_events => events = _events);

  function setWidth(width) {
    changesRenderer.setWidth(width);
    issuesRenderer.setWidth(width);
  }

  function setHighlightedEvent(event) {
    changesRenderer.setHighlightedEvent(event);
    issuesRenderer.setHighlightedEvent(event);
  }

  function draw() {
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
