import {combineLatest} from 'reactive-observables';
import {sortedIndexBy} from 'lodash';

import getEventUpdates from 'in-services/subscription/eventUpdates';
import getOpenEvents from 'in-services/subscription/newOpenEvents';
import {
  focusedMoment$,
  timeframe$,
  to$,
  from$
} from 'in-stores/timeline';
import getEvents from 'in-services/subscription/events';
import {createStore} from 'in-stores/store';


export const retrievedEvents$ = timeframe$
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
  });


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


function insertSorted(store, event) {
  const time = event.get('start');
  const id = event.get('id');
  // Assigning some props to immutable object to allow for faster binary search and filtering
  event.time = time;
  event.id = id;
  event.start = event.get('start');
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
}
