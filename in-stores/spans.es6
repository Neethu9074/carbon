import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import createTraceObservable from 'in-services/subscription/trace';
import {createStore, createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';

const selectedSpanIdStore = createStore({
  name: 'selectedSpanId',
  initialValue: null
});
export const selectedSpanId = selectedSpanIdStore.observable.distinct();

export const selectedSpan = createTrackingStore({
  name: 'selectedSpan',
  observable: selectedSpanId.flatMap(spanId => {
    if (spanId) {
      return createTraceObservable(spanId);
    }
    return alwaysNull;
  })
}).observable;

export function setSelectedSpanId(id) {
  if (id == null) {
    clearSelectedSpanId();
  } else {
    mutateUrl(navParams => {
      navParams.query.spanId = encodeURIComponent(id);
      return navParams;
    });
  }
}

export function clearSelectedSpanId() {
  mutateUrl(navParams => {
    delete navParams.query.spanId;
    return navParams;
  });
}

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('spanId' in query) {
    const spanId = decodeURIComponent(query.spanId);
    selectedSpanIdStore.applyStateMutation(() => spanId);
  } else {
    selectedSpanIdStore.applyStateMutation(() => null);
  }
});
