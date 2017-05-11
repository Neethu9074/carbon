import { getKeyCount, shallowCopy } from 'in-services/util/object';
import { createStore } from 'in-stores/store';

const selectedTraces = createStore({
  name: 'traces/analytics/selectedTraces',
  // trace id => immutable shallow root span
  initialValue: {},
  reducers: {
    toggle: toggleReducer
  }
});
export const selectedTraces$ = selectedTraces.observable;
export const selectedTracesCount$ = selectedTraces$.map(getKeyCount);

function toggleReducer(currentState, action) {
  const traceId = action.trace.get('traceId');
  const newState = shallowCopy(currentState);
  if (traceId in newState) {
    delete newState[traceId];
  } else {
    newState[traceId] = action.trace;
  }
  return newState;
}

export function toggleIncludeInAnalytics(trace) {
  selectedTraces.applyStateMutation({
    type: 'toggle',
    trace
  });
}
