import * as ro from 'reactive-observables';

import {emptyList} from 'in-services/fixedImmutables';

const reemitSpec = {emitLatestOnSubscribe: true};

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
