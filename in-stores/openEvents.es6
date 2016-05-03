import createEventObservable from 'in-services/subscription/openEvents';

export function getOpenEvents(to) {
  return createEventObservable(to);
}
