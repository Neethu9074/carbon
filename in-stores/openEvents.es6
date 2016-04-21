import createEventObservable from 'in-services/subscription/openEvents';
import {timeframe$} from 'in-stores/timeline';

export function getOpenEvents() {
  return timeframe$.flatMap(timeframe => createEventObservable(timeframe.to));
}
