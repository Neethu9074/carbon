import {sortedIndexBy} from 'lodash';

import {getHistoricalEvents} from 'in-stores/historicalEvents';
import {timeframe$} from 'in-stores/timeline';

export const eventsAroundTimeframe$ = timeframe$
  .flatMap(timeframe => {
    return getHistoricalEvents({
      // Increase amount of retrieved data to ensure smooth vertical scrolling.
      to: timeframe.to == null ? null : timeframe.to + timeframe.windowSize / 2,
      windowSize: timeframe.windowSize * 2
    });
  })
  .scan((store, update) => {
    // Instead of supplying this as the second parameter to scan, we deliberately
    // create this in the scan call. This has a major benefit:
    //
    // When nobody is subscribed to this store$, the store will be automatically cleared!
    if (store == null) {
      store = {
        // Sorted array of events[] by start time. Permits quick lookup of events within a
        // time range. Each events[] has a time property for fast lookups and comparisons
        issues: [],
        changes: [],
        incidents: []
      };
    }

    update.forEach(event => insertSorted(store, event));

    return store;
  }, null);


function insertSorted(store, event) {
  const time = event.get('start');
  const type = event.get('type');
  const byTime = store[type + 's'];

  // Assigning time to `time` property to allow faster binary
  // search and same interface as the arrays.
  event.time = time;
  const index = sortedIndexBy(byTime, event, e => e.time);

  const existingItem = byTime[index];
  if (!existingItem || existingItem.time !== time) {
    const newItem = [event];
    newItem.time = event.get('start');
    byTime.splice(index, 0, newItem);
  } else {
    const id = event.get('id');
    const eventsAtTime = byTime[index];
    let isNewEvent = true;

    for (let i = 0, len = eventsAtTime.length; i < len && isNewEvent; i++) {
      if (eventsAtTime[i].get('id') === id) {
        eventsAtTime[i] = event;
        isNewEvent = false;
      }
    }

    if (isNewEvent) {
      eventsAtTime.push(event);
    }
  }
}
