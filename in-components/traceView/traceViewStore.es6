import {combineLatest} from 'reactive-observables';

import {timeframe as timeframe$, from$, to$} from 'in-stores/timeline';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {createStore} from 'in-stores/store';
import {getTraces} from 'in-stores/traces';
import {getLabel} from 'in-sdk/tracing';

const highlightedSpanIdStore = createStore({
  name: 'in-components/traceView/traceViewStore/highlightedSpanId',
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


const tracesStore = createStore({
  name: 'in-components/traceView/traceViewStore/shownTraces',
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
  name: 'in-components/traceView/traceViewStore/loadingTraces',
  initialValue: false
});

const sortBy = createStore({
  name: 'in-components/traceView/traceViewStore/tracesSortBy',
  initialValue: 'ts'
});

export function setSortBy(newSortBy) {
  sortBy.applyStateMutation(()=>newSortBy);
  refresh();
}

const sortDirection = createStore({
  name: 'in-components/traceView/traceViewStore/tracesSortDirection',
  initialValue: 'desc'
});

export function setSortDirection(newSortDirection) {
  sortDirection.applyStateMutation(()=>newSortDirection);
  refresh();
}

export const sortBy$ = sortBy.observable;
export const sortDirection$ = sortDirection.observable;
export const isLoading$ = isLoadingStore.observable;


const autoUpdateStore = createStore({
  name: 'in-components/traceView/traceViewStore/traceViewAutoUpdate',
  initialValue: false
});
export const autoUpdate$ = autoUpdateStore.observable;

// Automatically refresh the shown traces upon timeframe change to reload and present data
// that is in the chosen timeframe.
let timeframeSubscription;

export function enable() {
  timeframeSubscription = timeframe$.subscribe(refresh);
}

export function disable() {
  timeframeSubscription.dispose();
}

let existingLoadMoreTracesSubscription;
export function loadMoreTraces() {
  disposeExistingLoad();

  combineLatest([oldestTraceStartTime$, from$, to$, sortBy$, sortDirection$])
    .once(([oldestTraceStartTime, from, to, currentSortBy, currentSortDirection]) => {
      isLoadingStore.applyStateMutation(() => true);
      // Remove 1 from the maxTimestamp to avoid being stuck in time, i.e. loading the same
      // data over and over again. This can happen when we have more than <pageSize> traces
      // with the same timestamp.
      const maxTimestamp = oldestTraceStartTime ? oldestTraceStartTime - 1 : to;
      existingLoadMoreTracesSubscription = getTraces(maxTimestamp, from, currentSortBy, currentSortDirection)
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
  loadMoreTraces();
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
