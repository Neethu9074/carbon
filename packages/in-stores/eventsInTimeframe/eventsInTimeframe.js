import { create, combineLatest } from 'reactive-observables';

import getEventsInTimeframeSubscription from 'in-subscription/eventsInTimeframe';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import { getEvent } from 'in-stores/events';

const data = new Map();
export const data$ = create().emit(data);
export const eventsInTimeframe$ = data$.throttle(1000).map(categorize);
let subscription;

export function init(timelineShown = false) {
  if (!timelineShown) {
    return;
  }

  subscription = combineLatest([timeConfig$, query$])
    .flatMap(([timeConfig, query]) =>
      getEventsInTimeframeSubscription({
        timeConfig,
        query
      })
    )
    .subscribe(onChange);
}

function onChange(rawEvents) {
  const length = rawEvents.length;
  mark();
  for (let i = 0; i < length; i++) {
    upsertEvent(rawEvents[i]);
  }
  sweep();
  emitRawDataChange();

  // TODO: ask ben what's about that one
  // rowsChanged$.emit(true);
}

function mark() {
  data.forEach(row => (row.marked = true));
}

function upsertEvent(event) {
  let eventProperty = data.get(event.id);
  let mutationCount = 0;
  if (eventProperty) {
    if (eventProperty.type === event.type) {
      eventProperty.marked = false;
      return;
    }
    mutationCount = eventProperty.mutationCount + 1;
    remove(eventProperty.id, eventProperty);
    eventProperty = null;
  }

  eventProperty = {
    mutationCount,
    marked: false,
    id: event.id,
    rawEvent: event
  };
  eventProperty.eventSubscription = getEvent(event.id).subscribe(_event => {
    eventProperty.event = _event;

    // store this property explicity for faster getNearestEvent checking
    eventProperty.event.time = _event.get('triggeringTime', _event.get('start'));

    emitRawDataChange();
  });

  data.set(eventProperty.id, eventProperty);
}

function emitRawDataChange() {
  data$.emit(data);
}

function sweep() {
  data.forEach((row, key) => {
    if (row.marked) {
      remove(key, row);
    }
  });
}

function remove(eventId, event) {
  event.eventSubscription.dispose();
  data.delete(eventId);
}

function categorize(_data) {
  const categories = {
    issues: [],
    changes: [],
    incidents: []
  };

  _data.forEach(eventProperty => {
    const type = `${eventProperty.rawEvent.type.toLowerCase()}s`;
    if (eventProperty.event && categories[type]) {
      categories[type].push(eventProperty.event);
    }
  });

  return categories;
}

export function disposeSubscription() {
  if (subscription) {
    subscription.dispose();
    subscription = null;
  }
  data.forEach((row, key) => {
    remove(key, row);
  });
}
