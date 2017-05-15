import { isEqual } from 'lodash';

import { maximumNumberOfTracesForAnalytics } from 'in-services/featureFlags';
import { getKeyCount, shallowCopy } from 'in-services/util/object';
import { createStore } from 'in-stores/store';

const selectedTraces = createStore({
  name: 'traces/analytics/selectedTraces',
  // trace id => immutable shallow root span
  initialValue: {},
  reducers: {
    toggle: toggleReducer,
    addTracesUntilMax: addTracesUntilMaxReducer,
    removeAll: removeAllReducer
  }
});
export const selectedTraces$ = selectedTraces.observable;
export const selectedTracesCount$ = selectedTraces$.map(getKeyCount);
export const selectedTraceIds$ = selectedTraces$
  .map(traces => Object.keys(traces).sort())
  .distinct((a, b) => !isEqual(a, b));

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

function addTracesUntilMaxReducer(currentState, action) {
  const newState = shallowCopy(currentState);

  for (
    let i = 0, length = action.traces.length;
    i < length && Object.keys(newState).length < maximumNumberOfTracesForAnalytics;
    i++
  ) {
    const trace = action.traces[i];
    newState[trace.get('traceId')] = trace;
  }

  return newState;
}

export function addTracesUntilMax(traces) {
  selectedTraces.applyStateMutation({
    type: 'addTracesUntilMax',
    traces
  });
}

function removeAllReducer() {
  return {};
}

export function removeAllTraces() {
  selectedTraces.applyStateMutation({
    type: 'removeAll'
  });
}
