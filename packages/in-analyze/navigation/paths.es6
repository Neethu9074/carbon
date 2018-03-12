import {
  traceId as traceIdMatrixParameter,
  applicationId as appIdMatrixParameter,
  serviceId as serviceIdMatrixParameter,
  endpointId as endpointIdMatrixParameter
} from 'in-analyze/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';

export const analyze = '/analyze';
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export function getLinkToAnalyze({ applicationId, serviceId, endpointId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = analyze;
    setOrDeleteMatrixKey(params, analyze, appIdMatrixParameter, applicationId);
    setOrDeleteMatrixKey(params, analyze, serviceIdMatrixParameter, serviceId);
    setOrDeleteMatrixKey(params, analyze, endpointIdMatrixParameter, endpointId);
  });
}

export function getLinkToTraceDetail(traceId, { tab = '/tree' } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${traceDetailFullyQualified}${tab}`;
    setOrDeleteMatrixKey(params, traceDetail, traceIdMatrixParameter, traceId);
  });
}
