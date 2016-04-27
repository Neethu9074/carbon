import createEventObservable from 'in-services/subscription/openEvents';
import {focusedMoment$} from 'in-stores/timeline';

export function getOpenEvents() {
  return focusedMoment$.flatMap(focusedMoment => createEventObservable(focusedMoment));
}
