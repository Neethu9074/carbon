import { createStore } from 'in-stores/store';

const isExpanded = createStore({
  name: 'eventView/populationChartExpandedStore',
  initialValue: false
});
export const isExpanded$ = isExpanded.observable;

export const maxEventsOnCollapsed = 7;

export function toggle() {
  isExpanded.applyStateMutation(oldValue => !oldValue);
}

export function restoreInitialExpandedState() {
  isExpanded.mutateTo(false);
}
