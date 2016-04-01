import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {createStore} from 'in-stores/store';
import {getTraces} from 'in-stores/traces';

const tracesStore = createStore({
  name: 'shownTraces',
  initialValue: []
});
export const traces$ = tracesStore.observable;


const slowestTraceDuration$ = traces$.map(traces => {
  if (traces.length === 0) {
    return null;
  }
  return traces[traces.length - 1].durationMillis;
});


const isLoadingStore = createStore({
  name: 'loadingTraces',
  initialValue: false
});
export const isLoading$ = isLoadingStore.observable;


const autoUpdateStore = createStore({
  name: 'traceViewAutoUpdate',
  initialValue: false
});
export const autoUpdate$ = autoUpdateStore.observable;


let existingLoadMoreTracesSubscription;
export function loadMoreTraces() {
  disposeExistingLoad();
  slowestTraceDuration$.once(slowestTraceDuration => {
    isLoadingStore.applyStateMutation(() => true);
    existingLoadMoreTracesSubscription = getTraces(slowestTraceDuration).once(addNewTraces);
  });
}


function disposeExistingLoad() {
  if (existingLoadMoreTracesSubscription) {
    existingLoadMoreTracesSubscription.dispose();
    existingLoadMoreTracesSubscription = null;
  }
}


function addNewTraces(newTraces) {
  const transformedTraces = newTraces.toArray().map(trace => {
    return {
      start: formatDateTime(trace.get('start')),
      duration: msZeroDecimalPlaces(trace.get('duration')),
      // required for inifinity scroll and loading of additional traces.
      durationMillis: trace.get('duration'),
      name: trace.get('name'),
      id: trace.get('traceId')
    };
  });
  tracesStore.applyStateMutation(existingTraces => existingTraces.concat(transformedTraces));
  isLoadingStore.applyStateMutation(() => false);
}


export function refresh() {
  clear();
}


export function clear() {
  disposeExistingLoad();
  tracesStore.applyStateMutation(() => []);
}

let intervalHandle;
export function toggleAutoRefresh() {
  autoUpdateStore.applyStateMutation(active => !active);
}

autoUpdate$.subscribe(active => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }

  if (active) {
    refresh();
    intervalHandle = setInterval(refresh, 10000);
  }
});
