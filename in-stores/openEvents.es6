import createEventObservable from 'in-services/subscription/openEvents';

export function getOpenEvents() {
  return createEventObservable();
}
