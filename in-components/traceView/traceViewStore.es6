import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {createStore} from 'in-stores/store';
import {getTraces} from 'in-stores/traces';
import {getLabel} from 'in-sdk/tracing';

const tracesStore = createStore({
  name: 'shownTraces',
  initialValue: []
});
export const traces$ = tracesStore.observable;


const oldestTraceStartTime$ = traces$.map(traces => {
  if (traces.length === 0) {
    return null;
  }
  return traces[traces.length - 1].startMillis;
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

// Automatically refresh the shown traces upon timeframe change to reload and present data
// that is in the chosen timeframe.
timeframe$.subscribe(refresh);

let existingLoadMoreTracesSubscription;
export function loadMoreTraces() {
  disposeExistingLoad();
  oldestTraceStartTime$.once(oldestTraceStartTime => {
    isLoadingStore.applyStateMutation(() => true);
    // Remove 1 from the maxTimestamp to avoid being stuck in time, i.e. loading the same
    // data over and over again. This can happen when we have more than <pageSize> traces
    // with the same timestamp.
    const maxTimestamp = oldestTraceStartTime ? oldestTraceStartTime - 1 : oldestTraceStartTime;
    existingLoadMoreTracesSubscription = getTraces(maxTimestamp)
      .once(addNewTraces);
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
      // required for inifinity scroll and loading of additional traces.
      startMillis: trace.get('start'),
      duration: msZeroDecimalPlaces(trace.get('duration')),
      name: getLabel(trace),
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
