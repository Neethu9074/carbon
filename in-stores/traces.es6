import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import createTracesObservable from 'in-services/subscription/traces';
import createTraceObservable from 'in-services/subscription/trace';
import {createStore, createTrackingStore} from 'in-stores/store';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {alwaysNull} from 'in-services/fixedStreams';

export const totalTraceCount$ = timeframe$.flatMap(createTotalTraceCountObservable);

const selectedTraceIdStore = createStore({
  name: 'selectedTraceId',
  initialValue: null
});
export const selectedTraceId = selectedTraceIdStore.observable.distinct();

export const selectedTrace = createTrackingStore({
  name: 'selectedTrace',
  observable: selectedTraceId.flatMap(traceId => {
    if (traceId) {
      return createTraceObservable(traceId);
    }
    return alwaysNull;
  })
}).observable;

export function setSelectedTraceId(id) {
  if (id == null) {
    clearSelectedTraceId();
  } else {
    mutateUrl(navParams => {
      navParams.query.traceId = encodeURIComponent(id);
      return navParams;
    });
  }
}

export function clearSelectedTraceId() {
  mutateUrl(navParams => {
    delete navParams.query.traceId;
    return navParams;
  });
}

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('traceId' in query) {
    const traceId = decodeURIComponent(query.traceId);
    selectedTraceIdStore.applyStateMutation(() => traceId);
  } else {
    selectedTraceIdStore.applyStateMutation(() => null);
  }
});


export function getTraces(maxTimestamp) {
  if (maxTimestamp) {
    return createTracesObservable(maxTimestamp);
  }

  return timeframe$.flatMap(timeframe => createTracesObservable(timeframe.to));
}
