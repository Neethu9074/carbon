import {create} from 'reactive-observables';

import createShedEventsObservable from 'in-services/subscription/shedEvents';
import {sortDirection$} from 'in-components/eventView/stores/sortDirection';
import {setIsLoading} from 'in-components/eventView/stores/isLoadingStore';
import {sortBy$} from 'in-components/eventView/stores/sortBy';
import {formatDateTime} from 'in-services/formatters/date';
import {timeframe$, from$, to$} from 'in-stores/timeline';
import {luceneQuery$ as query$} from 'in-stores/search';
import {emptyArray} from 'in-services/fixedObjects';
import {createStore} from 'in-stores/store';


let subscriptions = emptyArray;
let initPhase = false;
let loadSubscription;

// Timestamp bounds to use for queries. Will only be updated when the view
// becomes visible, when the timeframe changes or when the user explicitly
// hits refresh (or via auto refresh).
let maxTimestamp;
let minTimestamp;

let sortDirection;
let sortByField;
let query;


const shedEventList = createStore({
  name: 'eventView/shedEventsStore',
  initialValue: []
});
export const shedEventList$ = shedEventList.observable;


// this stream is used to resubscribe for new shed events data. because there are many factors causing a refresh,
// it is capsuled within a stream to be able to throttle refreshes.
const refreshStream = create();
refreshStream.nextFrame().subscribe(refresh);

export function enable() {
  initPhase = true;

  subscriptions = [
    sortDirection$.subscribe(_sortDirection => {
      sortDirection = _sortDirection;
      refreshStream.emit(true);
    }),

    sortBy$.subscribe(_sortBy => {
      sortByField = _sortBy;
      refreshStream.emit(true);
    }),

    timeframe$.subscribe(() => refreshStream.emit(true)),

    query$.subscribe(_query => {
      query = _query;
      refreshStream.emit(true);
    })
  ];

  initPhase = false;
  refreshStream.emit(true);
}

export function disable() {
  shedEventList.mutateTo([]);
  subscriptions.forEach(s => s.dispose());
  disposeExistingLoad();
  subscriptions = emptyArray;
}

function refresh() {
  if (initPhase) {
    return;
  }

  // get necessary params to load more events
  to$.once(to => maxTimestamp = to);
  from$.once(from => minTimestamp = from);
  shedEventList.mutateTo([]);

  loadMoreShedEvents();
}

export function loadMoreShedEvents() {
  disposeExistingLoad();
  setIsLoading(true);

  shedEventList$.once(events => {
    const offset = events.length;
    const maxTimestampForQuery = getMaxStartMillis(events, maxTimestamp);
    // console.log(new Date(maxTimestampForQuery));
    loadSubscription = createShedEventsObservable({
      maxTimestamp: maxTimestampForQuery,
      minTimestamp,
      sortByField,
      sortMode: sortDirection,
      query,
      offset
    })
    .once(addNewEvents);
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
      start: formatDateTime(event.get('start')),
      end: event.get('end', ''),
      title: event.get('title'),
      severity: Math.max(0, event.get('severity'))
    };
  });
  shedEventList.applyStateMutation(existingEvents => existingEvents.concat(transformedEvents));
  setIsLoading(false);
}

function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}
