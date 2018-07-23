import {
  applicationFilter as applicationFilterMatrixParameter,
  traceId as traceIdMatrixParameter,
  groupBy as groupByMatrixParameter,
  callId as callIdMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getGroupToUrlString,
  getApplicationFilterToUrlString,
  getApplicationFilterFromUrlString
} from 'in-analyze/CallsList/filterBuilder';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import { deepCopy } from 'in-services/util/object';

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

    let applicationFilter = deepCopy(getApplicationFilterFromUrlString(params));
    if (applicationName) {
      applicationFilter[APPLICATION.id] = { name: APPLICATION.name, value: applicationName };
    }
    if (serviceName) {
      applicationFilter[SERVICE.id] = { name: SERVICE.name, value: serviceName };
    }
    if (endpointName) {
      applicationFilter[ENDPOINT.id] = { name: ENDPOINT.name, value: endpointName };
    }

    setOrDeleteMatrixKey(
      params,
      analyze,
      applicationFilterMatrixParameter,
      getApplicationFilterToUrlString(applicationFilter)
    );
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
