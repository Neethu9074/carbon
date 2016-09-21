import {combineLatest} from 'reactive-observables';

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
