import {combineLatest} from 'reactive-observables';

import {emptyArray} from 'in-services/fixedObjects';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {selectedEventId$} from 'in-stores/events';
import {getEvent} from 'in-services/issueTracker';


export const recentEvents$ = createTrackingStore({
  name: 'eventView/recentEvents',
  observable: selectedEventId$.flatMap(id => id ? getEvent(id) : alwaysNull)
                              .flatMap(event => {
                                const recentEvents = event
                                  ? event.get('recentEvents')
                                  : null;
                                return recentEvents
                                 ? combineLatest(recentEvents.toArray().map(id => getEvent(id)))
                                 : alwaysNull;
                              })
}).observable;

export const sortedRecentEvents$ = recentEvents$.map(events =>
  events ? events.slice().sort((a, b) => a.get('start') > b.get('start')) : emptyArray);
