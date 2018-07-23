import {
  tagFilter as tagFilterMatrixParameter,
  traceId as traceIdMatrixParameter,
  groupBy as groupByMatrixParameter,
  callId as callIdMatrixParameter
} from 'in-analyze/navigation/matrix';
import { getTagFilterToUrlString, getGroupToUrlString } from 'in-analyze/filterBuilder';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';

export const analyze = '/analyze';
export const analyzeGroups = `${analyze}/groups`;
export const analyzeRaw = `${analyze}/raw`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export const isAnalyzeView = getRootPathPredicate(analyze);

export function getLinkToAnalyze({ applicationName, serviceName, endpointName, preGrouped, raw } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = analyze;
    if (raw) {
      setOrDeleteMatrixKey(params, analyze, groupByMatrixParameter, null);
    }

    if (preGrouped) {
      setOrDeleteMatrixKey(
        params,
        analyze,
        groupByMatrixParameter,
        getGroupToUrlString({ name: 'call.name', value: '' })
      );
    }

    const tagFilter = [];
    if (applicationName) {
      tagFilter.push({ name: APPLICATION.name, value: applicationName });
    }
    if (serviceName) {
      tagFilter.push({ name: SERVICE.name, value: serviceName });
    }
    if (endpointName) {
      tagFilter.push({ name: ENDPOINT.name, value: endpointName });
    }

    setOrDeleteMatrixKey(params, analyze, tagFilterMatrixParameter, getTagFilterToUrlString(tagFilter));
  });
}

export function getLinkToTraceDetail(traceId, { tab = '/tree', callId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${traceDetailFullyQualified}${tab}`;
    setOrDeleteMatrixKey(params, traceDetail, traceIdMatrixParameter, traceId);
    setOrDeleteMatrixKey(params, traceDetail, callIdMatrixParameter, callId);
    callId;
  });
}
