import {sortedIndexBy} from 'lodash';
import {combineLatest} from 'reactive-observables';

import {getHistoricalEvents} from 'in-stores/historicalEvents';
import getOpenEvents from 'in-services/subscription/openEvents';
import {timeframe$, to$, from$} from 'in-stores/timeline';

// TODO Backend data subscription doesn't really work. We have duplicate
// data retrieval going on and updates aren't always properly received.
// Change it to:
//  a) Get all data for a specific time window (timeframe as parameter)
//  c) Get all updates (no parameters)
//
// Much easier to handle and reason update. Current backend subscriptions
// are too complicated.
export const retrievedEvents$ = timeframe$
  .flatMap(timeframe => {
    // TODO replace with get historical data subscription
    return getHistoricalEvents({
      // Increase amount of retrieved data to ensure smooth vertical scrolling.
      to: timeframe.to == null ? null : timeframe.to + timeframe.windowSize / 2,
      windowSize: timeframe.windowSize * 2
    });
  })

  // TODO replace with get all updates subscription
  .merge(getOpenEvents())
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
