import createTraceObservable from 'in-services/subscription/traces';

export function getTraces(onlyTracesFasterThan) {
  return createTraceObservable(onlyTracesFasterThan);
}
