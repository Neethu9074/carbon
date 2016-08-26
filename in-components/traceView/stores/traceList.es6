import {combineLatest} from 'reactive-observables';
import {debounce} from 'lodash';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {timeframe$, from$, to$} from 'in-stores/timeline';
import {luceneQuery$} from 'in-stores/search';
import {createStore} from 'in-stores/store';
import {getTraces} from 'in-stores/traces';
import {getLabel} from 'in-sdk/tracing';


const tracesStore = createStore({
  name: 'in-components/traceView/stores/traceList/shownTraces',
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
  name: 'in-components/traceView/stores/traceList/loadingTraces',
  initialValue: false
});

const sortBy = createStore({
  name: 'in-components/traceView/stores/traceList/tracesSortBy',
  initialValue: 'ts'
});

export const refresh = debounce(() => {
  clear();
  loadMoreTraces();
}, 100);

export function setSortBy(newSortBy) {
  sortBy.applyStateMutation(()=>newSortBy);
  refresh();
}

const sortDirection = createStore({
  name: 'in-components/traceView/stores/traceList/tracesSortDirection',
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
  name: 'in-components/traceView/stores/traceList/traceViewAutoUpdate',
  initialValue: false
});
export const autoUpdate$ = autoUpdateStore.observable;

// Automatically refresh the shown traces upon timeframe change to reload and present data
// that is in the chosen timeframe.
let timeframeSubscription;
// Automatically refresh the shown traces when the query changes.
let luceneQuerySubscription;

export function enable() {
  timeframeSubscription = timeframe$.subscribe(refresh);
  luceneQuerySubscription = luceneQuery$.subscribe(refresh);
}

export function disable() {
  timeframeSubscription.dispose();
  luceneQuerySubscription.dispose();
}

let existingLoadMoreTracesSubscription;
export function loadMoreTraces() {
  disposeExistingLoad();

  combineLatest([oldestTraceStartTime$, from$, to$, sortBy$, sortDirection$, luceneQuery$])
    .once(([oldestTraceStartTime, from, to, currentSortBy, currentSortDirection, luceneQuery]) => {
      isLoadingStore.applyStateMutation(() => true);
      // Remove 1 from the maxTimestamp to avoid being stuck in time, i.e. loading the same
      // data over and over again. This can happen when we have more than <pageSize> traces
      // with the same timestamp.
      const maxTimestamp = oldestTraceStartTime ? oldestTraceStartTime - 1 : to;
      existingLoadMoreTracesSubscription = getTraces(
          maxTimestamp,
          from,
          currentSortBy,
          currentSortDirection,
          luceneQuery
        )
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
      id: trace.get('traceId'),
      totalErrorCount: trace.get('totalErrorCount', 0)
    };
  });
  tracesStore.applyStateMutation(existingTraces => existingTraces.concat(transformedTraces));
  isLoadingStore.applyStateMutation(() => false);
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
