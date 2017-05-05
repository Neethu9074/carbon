import { create, combineLatest } from 'reactive-observables';

import getEventsInTimeframeSubscription from 'in-services/subscription/eventsInTimeframe';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { query$ } from 'in-stores/search/query';
import { getEvent } from 'in-stores/events';

const data = {};
export const data$ = create().emit(data);
export const eventsInTimeframe$ = data$.throttle(1000).map(categorize);

export function init() {
  combineLatest([focusedMoment$, timeframe$, query$])
    .flatMap(([_focusedMoment, _timeframe, _query]) =>
      getEventsInTimeframeSubscription({
        focusedMoment: _focusedMoment,
        timeframe: _timeframe,
        query: _query
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
  for (let rowKey in data) {
    data[rowKey].marked = true;
  }
}

function upsertEvent(event) {
  let eventProperty = data[event.id];
  let mutationCount = 0;
  if (eventProperty) {
    if (eventProperty.type === event.type) {
      eventProperty.marked = false;
      return;
    }
    mutationCount = eventProperty.mutationCount + 1;
    remove(eventProperty.id);
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

  data[eventProperty.id] = eventProperty;
}

function emitRawDataChange() {
  data$.emit(data);
}

function sweep() {
  for (let eventId in data) {
    if (data[eventId].marked) {
      remove(eventId);
    }
  }
}

function remove(eventId) {
  data[eventId].eventSubscription.dispose();
  delete data[eventId];
}

function categorize(data) {
  const categories = {
    issues: [],
    changes: [],
    incidents: [],
    objectives: []
  };

  for (let eventId in data) {
    const eventProperty = data[eventId];
    const type = `${eventProperty.rawEvent.type.toLowerCase()}s`;
    if (eventProperty.event && categories[type]) {
      categories[type].push(eventProperty.event);
    }
  }

  return categories;
}
