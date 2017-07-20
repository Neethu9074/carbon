import { combineLatest, create } from 'reactive-observables';

import { timeframe$, from$, to$, focusedMoment$ } from 'in-stores/timeline';
import { sortDirection$ } from 'in-views/traceView/stores/sortDirection';
import createTracesObservable from 'in-services/subscription/traces';
import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import { debouncedQuery$ as query$ } from 'in-stores/search/query';
import { autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import { formatDateTime } from 'in-services/formatters/date';
import { sortBy$ } from 'in-views/traceView/stores/sortBy';
import { createStore } from 'in-stores/store';
import { getLabel } from 'in-sdk/tracing';

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
let focusedMoment;

let sortByField;
let sortDirection;
let query;

const tracesStore = createStore({
  name: 'traceView/stores/traceList/traces',
  initialValue: []
});
export const traces$ = tracesStore.observable;

const isLoadingStore = createStore({
  name: 'traceView/stores/traceList/isLoading',
  initialValue: false
});
export const isLoading$ = isLoadingStore.observable;

// this stream is used to resubscribe for new raw events data. because there are many factors causing a refresh,
// it is capsuled within a stream to be able to throttle refreshes.
const refreshStream = create();
refreshStream.nextFrame().subscribe(refresh);

export function enable() {
  initPhase = true;
  subscriptions = [];
  clearInterval(autoUpdateHandle);

  subscriptions.push(timeframe$.subscribe(() => refreshStream.emit(true)));
  subscriptions.push(focusedMoment$.subscribe(() => refreshStream.emit(true)));
  subscriptions.push(
    sortBy$.subscribe(_sortBy => {
      sortByField = _sortBy;
      refreshStream.emit(true);
    })
  );
  subscriptions.push(
    sortDirection$.subscribe(_sortDirection => {
      sortDirection = _sortDirection;
      refreshStream.emit(true);
    })
  );
  subscriptions.push(
    query$.subscribe(_query => {
      query = _query;
      refreshStream.emit(true);
    })
  );
  subscriptions.push(
    autoUpdate$.subscribe(autoUpdate => {
      clearInterval(autoUpdateHandle);

      if (autoUpdate) {
        refreshStream.emit(true);
        autoUpdateHandle = setInterval(() => refreshStream.emit(true), 10000);
      }
    })
  );

  initPhase = false;
  enabled = true;
  refreshStream.emit(true);
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

  combineLatest([focusedMoment$, to$, from$]).once(([_focusedMoment, to, from]) => {
    focusedMoment = _focusedMoment;
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
      time: focusedMoment,
      maxTimestamp: maxTimestampForQuery,
      minTimestamp,
      sortByField,
      sortMode: sortDirection,
      query,
      offset
    }).once(addNewTraces);
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
      sourceServiceId: trace.getIn(['rels', 'sourceServiceId']),
      destinationServiceId: trace.getIn(['rels', 'destinationServiceId']),
      raw: trace
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
