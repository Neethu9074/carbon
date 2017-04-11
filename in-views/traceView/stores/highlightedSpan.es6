import {createStore} from 'in-stores/store';

const highlightedSpanIdStore = createStore({
  name: 'traceView/stores/highlightedSpanId',
  initialValue: null
});
export const highlightedSpanId$ = highlightedSpanIdStore.observable;

// clear highlighted span automatically after n millis as this is meant as a
// temporary highlighting mechanism
highlightedSpanId$
  .filter(spanId => spanId != null)
  .debounce(1000)
  .subscribe(() => highlightedSpanIdStore.mutateTo(null));

export function highlightSpanId(spanId) {
  highlightedSpanIdStore.mutateTo(spanId);
}
