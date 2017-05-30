import { createStore } from 'in-stores/store';

const groupSorting = createStore({
  name: 'in-views/traceAnalyticsView/stores/groupSorting',
  initialValue: 'total',
  reducers: {
    set: setReducer
  }
});

export const groupSorting$ = groupSorting.observable;

function setReducer(_currentStoreState, action) {
  return action.sorting;
}

export function setGroupSorting(sorting) {
  return groupSorting.applyStateMutation({
    type: 'set',
    sorting
  });
}
