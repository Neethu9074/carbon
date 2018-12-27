import {
  tagFilter as tagFilterMatrixParameter,
  traceId as traceIdMatrixParameter,
  groupBy as groupByMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  callId as callIdMatrixParameter,
  orderBy as orderByMatrixParameter,
  orderDirection as orderDirectionMatrixParameter
} from 'in-analyze/navigation/matrix';
import { getTagFilterToUrlString, getGroupToUrlString } from 'in-analyze/filterBuilder';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';

export const analyze = '/analyze';
export const analyzeRaw = `${analyze}/raw`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export const isAnalyzeView = getRootPathPredicate(analyze);

export function getLinkToAnalyze({
  applicationName,
  serviceName,
  endpointName,
  dataSource = 'traces',
  filters,
  groupByTag,
  orderBy,
  orderDirection
} = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = analyze;

    if (dataSource != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${dataSourceMatrixParameter}`, dataSource);
    }

    if (groupByTag != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${groupByMatrixParameter}`, getGroupToUrlString(groupByTag));
    }

    // Force lazy initialization of tagFilter so that we can differentiate between deliberate decision to reset filters
    // and just no desire to change filters.
    let tagFilter = null;
    if (applicationName != null) {
      tagFilter = tagFilter || [];
      tagFilter.push({ name: APPLICATION.name, value: applicationName });
    }
    if (serviceName != null) {
      tagFilter = tagFilter || [];
      tagFilter.push({ name: SERVICE.name, value: serviceName });
    }
    if (endpointName != null) {
      tagFilter = tagFilter || [];
      tagFilter.push({ name: ENDPOINT.name, value: endpointName });
    }
    if (filters) {
      tagFilter = tagFilter || [];
      tagFilter.push(...filters);
    }

    if (tagFilter != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${tagFilterMatrixParameter}`, getTagFilterToUrlString(tagFilter));
    }

    const orderMatrixParameterPrefix = groupByTag == {} ? 'rawItems.' : 'groups.';
    if (orderBy != null) {
      setOrDeleteMatrixKey(params, analyze, `${orderMatrixParameterPrefix}${orderByMatrixParameter}`, orderBy);
    }

    if (orderDirection != null) {
      setOrDeleteMatrixKey(
        params,
        analyze,
        `${orderMatrixParameterPrefix}${orderDirectionMatrixParameter}`,
        orderDirection
      );
    }
  });
}

export function getLinkToTraceDetail(traceId, { tab = '/tree', callId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${traceDetailFullyQualified}${tab}`;
    setOrDeleteMatrixKey(params, traceDetail, traceIdMatrixParameter, traceId);
    setOrDeleteMatrixKey(params, traceDetail, callIdMatrixParameter, callId);

    // make sure that there is no grouping as otherwise the trace cannot be loaded.
    setOrDeleteMatrixKey(params, analyze, `callList.${groupByMatrixParameter}`, getGroupToUrlString({}));
  });
}
