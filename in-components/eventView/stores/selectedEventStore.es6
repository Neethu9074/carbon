import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {getEvent} from 'in-services/issueTracker';
import {selectedEventId$} from 'in-stores/events';


export const selectedEvent$ = createTrackingStore({
  name: 'eventView/selectedEventStore',
  observable: selectedEventId$.flatMap(id => id ? getEvent(id) : alwaysNull)
}).observable;
