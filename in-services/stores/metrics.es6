import Immutable from 'immutable';
import invariant from 'invariant';
import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

const emptyList = Immutable.List();

export const metricPath = ro.create(reemitSpec);
metricPath.emit(emptyList);

export function setMetricPath(path) {
  metricPath.emit(path);
}

export function clearMetricPath() {
  metricPath.emit(emptyList);
}


export const activeMetric = ro.create(reemitSpec);
clearActiveMetric();

export function setActiveMetric(metric) {
  activeMetric.emit(metric);
}

export function clearActiveMetric() {
  activeMetric.emit(null);
}



// an array of metric names to visualize
// TODO Ben remove once Map has been refactored
export const activeMetrics = ro.create(reemitSpec);
activeMetrics.emit([]);

export function select(metrics) {
  invariant(metrics instanceof Array, 'Metrics must be an array of strings.');
  activeMetrics.emit(metrics);
}

export function clear() {
  activeMetrics.emit([]);
}
