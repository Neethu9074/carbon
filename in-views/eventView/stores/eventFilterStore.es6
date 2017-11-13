import { createStore } from 'in-stores/store';

const eventFilter = createStore({
  name: 'eventView/eventFilter',
  initialValue: undefined
});
export const eventFilter$ = eventFilter.observable;

export function setEventTypeFilter(filter) {
  eventFilter.mutateTo(filter);
}
