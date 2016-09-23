import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {createTrackingStore} from 'in-stores/store';
// import {alwaysNull} from 'in-services/fixedStreams';
// import {getEvent} from 'in-services/issueTracker';
// import {selectedEventId$} from 'in-stores/events';


export const selectedEvent$ = createTrackingStore({
 name: 'eventView/selectedEventStore',
 // HACK FOR FAKE EVENTS
 // observable: selectedEventId$.flatMap(id => id ? getEvent(id) : alwaysNull)
 observable: create().startWith(Immutable.fromJS({
   id: 'id1',
   type: 'incident',
   start: Date.now() - 1000 * 40,
   recentEvents: ['id2', 'id3'],
   title: 'incident incoming',
   severity: 5
 })).freeze()
}).observable;
