import { analyseTraces } from 'in-stores/traces/analytics/analysedTraces';
import { createStore } from 'in-stores/store';

const markedTraces = createStore({
  name: 'traces/analytics/markedTraces',
  initialValue: new Map(),
  reducers: {
    toggle: toggleReducer,
    mark: markReducer,
    markTraces: markTracesReducer,
    addMarked: addMarkedReducer,
    clearTrace: clearTraceReducer,
    clear: clearReducer
  }
});

export const markedTraces$ = markedTraces.observable;

function toggleReducer(_markedTraces, action) {
  const traceId = action.trace.get('traceId');

  if (_markedTraces.has(traceId)) {
    _markedTraces.delete(traceId);
  } else {
    _markedTraces.set(traceId, action.trace);
  }
  return _markedTraces;
}

export function toggleTraceId(id, trace) {
  markedTraces.applyStateMutation({
    type: 'toggle',
    trace
  });
}

function markReducer(_markedTraces, action) {
  _markedTraces.set(action.trace.get('traceId'), action.trace);
  return _markedTraces;
}

export function markTrace(id, trace) {
  markedTraces.applyStateMutation({
    type: 'mark',
    trace
  });
}

function clearTraceReducer(_markedTraces, action) {
  _markedTraces.delete(action.traceId);
  return _markedTraces;
}

export function clearTraceId(traceId) {
  markedTraces.applyStateMutation({
    type: 'clearTrace',
    traceId
  });
}

function clearReducer(_markedTraces) {
  _markedTraces.clear();
  return _markedTraces;
}

export function clear() {
  markedTraces.applyStateMutation({
    type: 'clear'
  });
}

function addMarkedReducer(_markedTraces) {
  const traces = [];
  _markedTraces.forEach(trace => traces.push(trace));
  analyseTraces(traces);

  _markedTraces.clear();
  return _markedTraces;
}

export function addMarkedTracesToAnalytics() {
  markedTraces.applyStateMutation({
    type: 'addMarked'
  });
}

function markTracesReducer(_markedTraces, action) {
  for (let i = 0, length = action.traces.length; i < length; i++) {
    const trace = action.traces[i];
    _markedTraces.set(trace.get('traceId'), trace);
  }
  return _markedTraces;
}

export function markTraces(traces) {
  markedTraces.applyStateMutation({
    type: 'markTraces',
    traces
  });
}
