import { createStore } from 'in-stores/store';

const selectedTraces = createStore({
  name: 'traces/analytics/selectedTraces',
  initialValue: [],
  reducers: {
    toggle: toggleReducer
  }
});
export const selectedTraces$ = selectedTraces.observable;

function toggleReducer(currentState, action) {
  const index = currentState.indexOf(action.traceId);
  const newState = currentState.slice();
  if (index === -1) {
    newState.push(action.traceId);
  } else {
    newState.splice(index, 1);
  }
  return newState;
}

export function toggleIncludeInAnalytics(traceId) {
  selectedTraces.applyStateMutation({
    type: 'toggle',
    traceId
  });
}
