import {combineLatest} from 'reactive-observables';

import {sortDirection$} from 'in-views/traceView/stores/sortDirection';
import {autoUpdate$} from 'in-views/traceView/stores/autoUpdate';
import createTracesObservable from 'in-services/subscription/traces';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {sortBy$} from 'in-views/traceView/stores/sortBy';
import {formatDateTime} from 'in-services/formatters/date';
import {timeframe$, from$, to$} from 'in-stores/timeline';
import {luceneQuery$ as query$} from 'in-stores/search';
import {createStore} from 'in-stores/store';
import {getLabel} from 'in-sdk/tracing';

let initPhase = false;
let enabled = false;
let subscriptions = [];
let loadSubscription;
let autoUpdateHandle;

// Timestamp bounds to use for queries. Will only be updated when the view
// becomes visible, when the timeframe changes or when the user explicitly
// hits refresh (or via auto refresh).
let maxTimestamp;
let minTimestamp;

let sortByField;
let sortDirection;
let query;

const tracesStore = createStore({
  name: 'in-views/traceView/stores/traceList/traces',
  initialValue: []
});
export const traces$ = tracesStore.observable;


const isLoadingStore = createStore({
  name: 'in-views/traceView/stores/traceList/isLoading',
  initialValue: false
});
export const isLoading$ = isLoadingStore.observable;


export function enable() {
  initPhase = true;
  subscriptions = [];
  clearInterval(autoUpdateHandle);

  subscriptions.push(timeframe$.subscribe(refresh));
  subscriptions.push(sortBy$.subscribe(_sortBy => {
    sortByField = _sortBy;
    refresh();
  }));
  subscriptions.push(sortDirection$.subscribe(_sortDirection => {
    sortDirection = _sortDirection;
    refresh();
  }));
  subscriptions.push(query$.subscribe(_query => {
    query = _query;
    refresh();
  }));
  subscriptions.push(autoUpdate$.subscribe(autoUpdate => {
    clearInterval(autoUpdateHandle);

    if (autoUpdate) {
      refresh();
      autoUpdateHandle = setInterval(refresh, 10000);
    }
  }));

  initPhase = false;
  enabled = true;
  refresh();
}


export function disable() {
  enabled = false;
  tracesStore.mutateTo([]);
  subscriptions.forEach(s => s.dispose());
  disposeExistingLoad();
  clearInterval(autoUpdateHandle);
  subscriptions = [];
}


export function refresh() {
  if (initPhase || !enabled) {
    return;
  }

  combineLatest([to$, from$])
    .once(([to, from]) => {
      maxTimestamp = to;
      minTimestamp = from;

      tracesStore.mutateTo([]);
      loadMoreTraces();
    });
}


export function loadMoreTraces() {
  if (initPhase || !enabled) {
    return;
  }

  disposeExistingLoad();
  isLoadingStore.mutateTo(true);

  traces$.once(traces => {
    const offset = traces.length;
    const isAscTsSort = sortByField === 'ts' && sortDirection === 'asc';
    const maxTimestampForQuery = isAscTsSort ? maxTimestamp : getMaxStartMillis(traces, maxTimestamp);
    loadSubscription = createTracesObservable({
        maxTimestamp: maxTimestampForQuery,
        minTimestamp,
        sortByField,
        sortMode: sortDirection,
        query,
        offset
      })
      .once(addNewTraces);
  });
}


function getMaxStartMillis(traces, fallback) {
  if (traces.length === 0) {
    return fallback;
  }
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0, len = traces.length; i < len; i++) {
    max = Math.max(max, traces[i].startMillis);
  }
  return max;
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
      totalErrorCount: trace.get('totalErrorCount', 0),
      serviceSnapshotId: trace.getIn(['rels', 'destinationServiceId'])
    };
  });
  tracesStore.applyStateMutation(existingTraces => {
    // There may be multiple successive traces requests with the same data. Protect against
    // this.
    const existingTraceIds = {};
    existingTraces.forEach(trace => {
      existingTraceIds[trace.id] = true;
    });
    return existingTraces.concat(transformedTraces.filter(trace => !existingTraceIds[trace.id]));
  });
  isLoadingStore.mutateTo(false);
}


function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}
