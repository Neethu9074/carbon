import { createStore } from 'in-stores/store';

const analysedTraces = createStore({
  name: 'traces/analytics/analysedTraces',
  initialValue: new Map(),
  reducers: {
    analyse: analyseReducer,
    remove: removeReducer
  }
});

export const analysedTraces$ = analysedTraces.observable;

function analyseReducer(_analysedTraces, action) {
  for (let i = 0, length = action.traces.length; i < length; i++) {
    const trace = action.traces[i];
    _analysedTraces.set(trace.get('traceId'), trace);
  }
  return _analysedTraces;
}

export function analyseTraces(traces) {
  analysedTraces.applyStateMutation({
    type: 'analyse',
    traces
  });
}

function removeReducer(_analysedTraces, action) {
  for (let i = 0, length = action.ids.length; i < length; i++) {
    _analysedTraces.delete(action.ids[i]);
  }
  return _analysedTraces;
}

export function removeTraceIds(ids) {
  analysedTraces.applyStateMutation({
    type: 'remove',
    ids
  });
}
