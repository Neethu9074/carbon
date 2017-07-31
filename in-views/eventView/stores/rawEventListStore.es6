import { combineLatest, create } from 'reactive-observables';

import { timeframe$, from$, to$, focusedMoment$ } from 'in-stores/timeline';
import createRawEventsObservable from 'in-services/subscription/rawEvents';
import { sortDirection$ } from 'in-views/eventView/stores/sortDirection';
import { setIsLoading } from 'in-views/eventView/stores/isLoadingStore';
import { autoUpdate$ } from 'in-views/eventView/stores/autoUpdate';
import { debouncedQuery$ as query$ } from 'in-stores/search/query';
import { sortBy$ } from 'in-views/eventView/stores/sortBy';
import { emptyArray } from 'in-services/fixedObjects';
import { createStore } from 'in-stores/store';

let subscriptions = emptyArray;
let initPhase = false;
let enabled = false;
let loadSubscription;

// Timestamp bounds to use for queries. Will only be updated when the view
// becomes visible, when the timeframe changes or when the user explicitly
// hits refresh (or via auto refresh).
let maxTimestamp;
let minTimestamp;
let focusedMoment;

let autoUpdateHandle;

let sortDirection;
let sortByField;
let query;

const rawEventList = createStore({
  name: 'eventView/rawEventsStore',
  initialValue: []
});
export const rawEventList$ = rawEventList.observable;

// this stream is used to resubscribe for new raw events data. because there are many factors causing a refresh,
// it is capsuled within a stream to be able to throttle refreshes.
const refreshStream = create();
refreshStream.nextFrame().subscribe(refresh);

export function enable() {
  initPhase = true;

  clearInterval(autoUpdateHandle);
  subscriptions = [
    sortDirection$.subscribe(_sortDirection => {
      sortDirection = _sortDirection;
      refreshStream.emit(true);
    }),
    sortBy$.subscribe(_sortBy => {
      sortByField = _sortBy;
      refreshStream.emit(true);
    }),
    focusedMoment$.subscribe(() => refreshStream.emit(true)),
    timeframe$.subscribe(() => refreshStream.emit(true)),
    query$.subscribe(_query => {
      query = _query;
      refreshStream.emit(true);
    }),
    autoUpdate$.subscribe(autoUpdate => {
      clearInterval(autoUpdateHandle);

      if (autoUpdate) {
        refreshStream.emit(true);
        autoUpdateHandle = setInterval(() => {
          refreshStream.emit(true);
        }, 10000);
      }
    })
  ];

  initPhase = false;
  enabled = true;
  refreshStream.emit(true);
}

export function disable() {
  enabled = false;

  rawEventList.mutateTo([]);
  subscriptions.forEach(s => s.dispose());
  disposeExistingLoad();
  clearInterval(autoUpdateHandle);
  subscriptions = emptyArray;
}

export function refresh() {
  if (initPhase || !enabled) {
    return;
  }

  combineLatest([focusedMoment$, to$, from$]).once(([_focusedMoment, to, from]) => {
    focusedMoment = _focusedMoment;
    maxTimestamp = to;
    minTimestamp = from;

    rawEventList.mutateTo([]);
    loadMoreRawEvents();
  });
}

export function loadMoreRawEvents() {
  if (initPhase || !enabled) {
    return;
  }

  setIsLoading(true);

  rawEventList$.once(events => {
    const offset = events.length;
    const isAscTimestampSort = (sortByField === 'start' || sortByField === 'end') && sortDirection === 'asc';
    const maxTimestampForQuery = isAscTimestampSort
      ? maxTimestamp
      : Math.max(minTimestamp, getMaxStartMillis(events, maxTimestamp));

    disposeExistingLoad();
    loadSubscription = createRawEventsObservable({
      time: focusedMoment,
      maxTimestamp: maxTimestampForQuery,
      minTimestamp,
      sortByField,
      sortMode: sortDirection,
      query,
      offset
    }).once(addNewEvents);
  });
}

function getMaxStartMillis(events, fallback) {
  if (events.length === 0) {
    return fallback;
  }
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0, len = events.length; i < len; i++) {
    max = Math.max(max, events[i].startMillis);
  }
  return max;
}

function addNewEvents(newEvents) {
  const transformedEvents = newEvents.toArray().map(event => {
    return {
      // required for inifinity scroll and loading of additional events. see getMaxStartMillis()
      startMillis: event.get('start'),

      id: event.get('id'),
      start: event.get('start'),
      end: event.get('end'),
      title: event.get('title'),
      severity: event.get('severity'),
      state: event.get('state'),
      type: event.get('type'),
      snapshotId: event.get('snapshotId')
    };
  });

  // there may be multiple successive events requests with the same data
  // protect against this and remove duplicates
  rawEventList.applyStateMutation(existingEvents => {
    const existingEventIds = {};
    existingEvents.forEach(trace => {
      existingEventIds[trace.id] = true;
    });
    return existingEvents.concat(transformedEvents.filter(trace => !existingEventIds[trace.id]));
  });

  setIsLoading(false);
}

function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}
