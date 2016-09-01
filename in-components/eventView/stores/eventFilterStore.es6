import {createStore} from 'in-stores/store';


export const FILTER = {
  INCIDENTS: 1,
  EVENTS: 2
};

const eventFilter = createStore({
  name: 'eventView/eventFilter',
  initialValue: FILTER.INCIDENTS
});
export const eventFilter$ = eventFilter.observable.distinct();

export function setFilter(filter) {
  eventFilter.applyStateMutation(() => filter);
}
