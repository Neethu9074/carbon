import {sortedIndexBy} from 'lodash';

import {getHistoricalEvents, getLatestEvents, getEventUpdates} from 'in-stores/events';
import {timeframe$} from 'in-stores/timeline';

// TODO clean up store

export const store$ = timeframe$
  .throttle(1000)
  .flatMap(timeframe => {
    if (timeframe.to == null) {
      return getLatestEvents(timeframe.windowSize)
        // Beware: Different formats! Immutable sequences vs. immutable events.
        .merge(getEventUpdates());
    }

    return getHistoricalEvents({
      // Increase amount of retrieved data to ensure smooth vertical scrolling.
      to: timeframe.to + timeframe.windowSize / 2,
      windowSize: timeframe.windowSize * 1.5
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
        byTime: [],

        // Maps event id => id
        byId: {}
      };
    }

    // We have different update formats:
    //
    // 1. Initial data and batch updates which may be multiple events.
    // 2. Updates for a single event which are just regular objects.
    if (update instanceof Array) {
      for (let i = 0, len = update.length; i < len; i++) {
        insertSorted(store.byTime, update[i]);
      }
    } else {
      insertSorted(store.byTime, update);
    }

    return store;
  }, null)
  .map(store => {
    // TODO extract events in selected timeframe
    return store;
  })
  .map(eventsInSelectedTime => {
    // TODO categorize
    return eventsInSelectedTime;
  });


function insertSorted(byTime, event) {
  const time = event.get('start');

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
    byTime[index].push(event);
  }
}
