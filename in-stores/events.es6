import {combineLatest} from 'reactive-observables';
import {sortedIndexBy} from 'lodash';
import Immutable from 'immutable';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import getEventUpdates from 'in-services/subscription/eventUpdates';
import getOpenEvents from 'in-services/subscription/newOpenEvents';
import {
  focusedMoment$,
  resolvedFocusedMoment$,
  timeframe$,
  to$,
  from$
} from 'in-stores/timeline';
import memoize from 'in-services/util/memoizingObservableGenerator';
import {createStore, createTrackingStore} from 'in-stores/store';
import getEvents from 'in-services/subscription/events';
import {theme} from 'in-services/theme';


export const retrievedEvents$ = createTrackingStore({
  name: 'retrievedEvents',
    observable: timeframe$
    .flatMap(timeframe => {
      return getEvents({
        // Increase amount of retrieved data to ensure smooth vertical scrolling.
        to: timeframe.to == null ? null : timeframe.to + timeframe.windowSize / 2,
        windowSize: timeframe.windowSize * 2
      });
    })
    .merge(
      getEventUpdates(),
      getOpenEvents(),
      focusedMoment$.flatMap(getOpenEvents)
    )
    .scan((store, update) => {
      update.forEach(event => insertSorted(store, event));
      return store;
    }, {
      // Sorted array of events[] by start time. Permits quick lookup of events within a
      // time range. Each events[] has a time property for fast lookups and comparisons
      issues: [],
      changes: [],
      incidents: []
    })
}).observable;


export const eventsInTimeframe$ = combineLatest([
    to$.throttle(5000),
    from$,
    retrievedEvents$
  ])
  .map(([to, from, events]) => {
    // TODO improve perf by doing a binary search for from, to and get a subarray
    return {
      issues: events.issues.filter(filter),
      changes: events.changes.filter(filter),
      incidents: events.incidents.filter(filter)
    };

    function filter(event) {
      return event.start >= from && event.start <= to;
    }
  });


export const openEventsAtServerTime$ = createTrackingStore({
  name: 'openEventsAtServerTime',
  observable: retrievedEvents$.map(events => {
      return {
        issues: events.issues.filter(filter),
        changes: events.changes.filter(filter),
        incidents: events.incidents.filter(filter)
      };

      function filter(event) {
        return event.state === 'open';
      }
    })
}).observable;


export const openEventsAtFocusedMoment$ = createTrackingStore({
  name: 'openEventsAtFocusedMoment',
  observable: combineLatest([
      resolvedFocusedMoment$.throttle(5000),
      retrievedEvents$
    ])
    .map(([time, events]) => {
      return {
        issues: events.issues.filter(filter),
        changes: events.changes.filter(filter),
        incidents: events.incidents.filter(filter)
      };

      function filter(event) {
        return event.start <= time && (time < event.end || event.end == null);
      }
    })
}).observable;


export const getOpenIssuesAtFocusedMoment = memoize(
  // TODO an index by entity would be great, but probably more expensive to
  // maintain than actually to loop?
  snapshotId => openEventsAtFocusedMoment$.map(events => {
      return Immutable.List(events.issues
        .filter(event => event.get('snapshotId') === snapshotId));
    }),

  id => id,

  3000
);


/**
 * Searches for the issue with the highest severity and returns it or the first
 * if many have the same severity
 *
 * @param {number} snapshotId The id to filter the event stream
 * @returns {Observable<Event>} The event with the highest severity
 */
export function getMostImportantEventAtFocusedMoment(snapshotId) {
  return getOpenIssuesAtFocusedMoment(snapshotId)
    .map(events => {
      let topEvent = null;
      let topSeverity = Number.MAX_VALUE * -1;

      events.forEach(event => {
        const severity = event.getIn(['problem', 'severity'], 0);
        if (severity > topSeverity) {
          topSeverity = severity;
          topEvent = event;
        }
      });

      return topEvent;
    })
    .distinct();
}


export const getColorForEventAtFocusedMomentAsStream = memoize(
  event => {
    const start = event.get('start');
    const end = event.get('end');
    const state = event.get('state');
    const severity = event.getIn(['problem', 'severity'], 0);
    const color = theme.health[severity] || theme.health[0];

    return focusedMoment$
      .map(focusedMoment => isEventOpenAtFocusedMoment(start, end, state, focusedMoment) ? color : theme.health[0])
      .distinct();
  },

  event => event.get('id'),

  5000
);

export function getColorForEventAtFocusedMoment(event, focusedMoment) {
  const severity = event.getIn(['problem', 'severity'], 0);
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const color = theme.health[severity] || theme.health[0];

  // No focused moment? Then it is according to server time which means
  // we color based on the state property.
  const open = isEventOpenAtFocusedMoment(start, end, state, focusedMoment);

  if (open) {
    return color;
  }

  return theme.health[0];
}

function isEventOpenAtFocusedMoment(start, end, state, focusedMoment) {
  // No focused moment? Then it is according to server time which means
  // we color based on the state property.
  return (focusedMoment == null && state === 'open') ||
         (start < focusedMoment && (focusedMoment < end || !end));
}


function insertSorted(store, event) {
  const time = event.get('start');
  const id = event.get('id');
  // Assigning some props to immutable object to allow for faster binary search and filtering
  event.time = time;
  event.id = id;
  event.start = event.get('start');
  event.end = event.get('end');
  event.state = event.get('state');
  const type = event.get('type');
  const byTime = store[type + 's'];

  const index = sortedIndexBy(byTime, event, e => e.time);

  const existingItem = byTime[index];
  if (existingItem) {
    if (existingItem.time !== time) {
      // event with new time
      byTime.splice(index, 0, event);
    } else if (existingItem.id === event.id) {
      // updates
      byTime[index] = event;
    } else {
      let i = index;
      let found = false;
      while (byTime[i] && byTime[i].time === time && !found) {
        if (byTime[i].id === id) {
          // update
          byTime[i] = event;
          found = true;
        }
        i++;
      }

      if (!found) {
        byTime.splice(index, 0, event);
      }
    }
  } else {
    byTime.splice(index, 0, event);
  }
}

export function getNearestEvent(events, timestamp, maxDistance = Number.MAX_VALUE) {
  if (events.length === 0) {
    return null;
  }

  let index = sortedIndexBy(events, {time: timestamp}, event => event.time);

  let B = events[index];
  if (!B) {
    index = events.length - 1;
    B = events[index];
  }
  const distanceToB = Math.abs(B.time - timestamp);

  if (index === 0) {
    if (distanceToB < maxDistance) {
      return B;
    }
    return null;
  }

  const A = events[index - 1];
  const distanceToA = Math.abs(A.time - timestamp);

  if (distanceToA <= distanceToB && distanceToA <= maxDistance) {
    return A;
  } else if (distanceToB < distanceToA && distanceToB <= maxDistance) {
    return B;
  }

  return null;
}


const highlightedEvent = createStore({
  name: 'highlightedEventStore',
  initialValue: null
});
export const highlightedEvent$ = highlightedEvent.observable.distinct();

export function setHighlightedEvent(event) {
  highlightedEvent.applyStateMutation(() => event);

  if (event) {
    setHighlightedEntityId(event.get('snapshotId'));
  } else {
    clearHighlightedEntityId();
  }
}
