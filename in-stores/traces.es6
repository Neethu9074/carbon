import createTraceObservable from 'in-services/subscription/traces';

export function getTraces() {
  return createTraceObservable();
}
