'use strict';

import invariant from 'invariant';
import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

// no path by default
export const metricPath = ro.create(reemitSpec);
metricPath.emit([]);

export function setPath(path) {
  metricPath.emit(path);
}

// an array of metric names to visualize
export const activeMetrics = ro.create(reemitSpec);
activeMetrics.emit([]);

export function select(metrics) {
  invariant(metrics instanceof Array, 'Metrics must be an array of strings.');
  activeMetrics.emit(metrics);
}

export function clear() {
  activeMetrics.emit([]);
}
