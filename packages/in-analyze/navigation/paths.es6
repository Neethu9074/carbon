import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';

export const analyze = '/analyze';
export const traceList = `/traces`;
export const traceListFullyQualified = `${analyze}/traces`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export function getLinkToAnalyze() {
  return getModifiedUrlStream(params => (params.pathname = analyze));
}

export function getLinkToTraceDetail(traceId, { tab = '/tree' } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${traceDetailFullyQualified}${tab}`;
    setOrDeleteMatrixKey(params, traceDetail, traceIdMatrixParameter, traceId);
  });
}
