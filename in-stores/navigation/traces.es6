import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';

export function getTraceViewWithSelectedTrace(traceId) {
  traceId = encodeURIComponent(traceId);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.traceId = traceId;
      return params;
    })
    .map(toUrl)
    .distinct();
}
