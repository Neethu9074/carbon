import {createStore} from 'in-stores/store';


const highlightedEventStore = createStore({
  name: 'in-components/traceView/stores/highlightedEventId',
  initialValue: null
});
export const highlightedEventId$ = highlightedEventStore.observable;

// clear highlighted event automatically after n millis as this is meant as a
// temporary highlighting mechanism
highlightedEventId$
  .filter(eventId => eventId != null)
  .debounce(1000)
  .subscribe(() => highlightedEventStore.mutateTo(null));

export function highlightEventId(eventId) {
  highlightedEventStore.mutateTo(eventId);
}
