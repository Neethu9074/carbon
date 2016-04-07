import createEventsWithinTimerangeObservable from 'in-services/subscription/eventsWithinTimerange';

export function getEventsWithinTimerange(props) {
  return createEventsWithinTimerangeObservable(props);
}
