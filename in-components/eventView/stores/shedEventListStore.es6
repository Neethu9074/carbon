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


export function enable() {
  initPhase = true;

  subscriptions = [
    sortDirection$.subscribe(_sortDirection => {
      sortDirection = _sortDirection;
      refresh();
    }),

    sortBy$.subscribe(_sortBy => {
      sortByField = _sortBy;
      refresh();
    }),

    timeframe$.subscribe(refresh),

    query$.subscribe(_query => {
      query = _query;
      refresh();
    })
  ];

  initPhase = false;
  refresh();
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
      end: event.get('end') ? formatDateTime(event.get('end')) : 'active',
      title: event.get('title'),
      severity: Math.max(0, event.get('severity'))
    };
  });
  shedEventList.applyStateMutation(existingEvents => {
    const seen = {};
    // remove duplicates based on id
    return existingEvents.concat(transformedEvents)
          .filter(item => {
            if (seen[item.id]) {
              return false;
            }
            seen[item.id] = true;
            return true;
          });
  });
  setIsLoading(false);
}

function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}
