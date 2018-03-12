import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const analyze = '/analyze';
export const traceList = `/traces`;
export const traceListFullyQualified = `${analyze}/traces`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export function getLinkToTraceDetail(traceId) {
  return getModifiedUrlStream(params => {
    params.pathname = traceDetailFullyQualified;
    setOrDeleteMatrixKey(params, traceDetail, traceIdMatrixParameter, traceId);
  });
}
