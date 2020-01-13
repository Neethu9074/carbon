import {
  tagFilter as tagFilterMatrixParameter,
  traceId as traceIdMatrixParameter,
  groupBy as groupByMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  callId as callIdMatrixParameter,
  orderBy as orderByMatrixParameter,
  orderDirection as orderDirectionMatrixParameter,
  metrics as metricsMatrixParameter,
  showGraph as showGraphMatrixParameter,
  serializeMetrics
} from 'in-analyze/navigation/matrix';
import { getTagFilterToUrlString, getGroupToUrlString, getTagFilterFromUrlString } from 'in-analyze/filterBuilder';
import { APPLICATION, APPLICATION_INBOUND, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
import { callAnalysisBlacklistedTags } from 'in-applications/tags';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { isBlank } from 'in-services/util/string';

export const analyze = '/analyze';
export const analyzeRaw = `${analyze}/raw`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export const isAnalyzeView = getRootPathPredicate(analyze);

export function getLinkToAnalyze({
  applicationName,
  serviceName,
  endpointName,
  boundaryScope = boundaryScopes.inbound,
  dataSource = 'traces',
  filters,
  groupByTag, // use an empty object to prevent default grouping
  orderBy,
  orderDirection,
  timeConfig,
  metrics,
  showGraph
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

      if (boundaryScope === boundaryScopes.all) {
        tagFilter.push({
          name: APPLICATION.name,
          value: applicationName,
          operator: operators.EQUALS,
          entity: entityTypes.DESTINATION
        });
      } else if (boundaryScope === boundaryScopes.inbound) {
        tagFilter.push({
          name: APPLICATION_INBOUND.name,
          value: applicationName,
          operator: operators.EQUALS
        });
      }
    }
    if (serviceName != null) {
      tagFilter = tagFilter || [];
      tagFilter.push({
        name: SERVICE.name,
        value: serviceName,
        operator: operators.EQUALS,
        entity: entityTypes.DESTINATION
      });
    }
    if (endpointName != null) {
      tagFilter = tagFilter || [];
      tagFilter.push({
        name: ENDPOINT.name,
        value: endpointName,
        operator: operators.EQUALS,
        entity: entityTypes.DESTINATION
      });
    }
    if (filters) {
      tagFilter = tagFilter || [];
      tagFilter.push(...filters);
    }

    if (tagFilter != null) {
      const values = {
        'application.name': applicationName,
        'service.name': serviceName,
        'endpoint.name': endpointName
      };
      tagFilter = tagFilter.map(
        filter => (values[filter.name] && Object.assign(filter, { value: values[filter.name] })) || filter
      );
      setOrDeleteMatrixKey(params, analyze, `callList.${tagFilterMatrixParameter}`, getTagFilterToUrlString(tagFilter));
    } else if (dataSource === 'calls') {
      // remove blacklisted filters
      let existingTagFilters = getTagFilterFromUrlString(
        getMatrixParameter(params, analyze, `callList.${tagFilterMatrixParameter}`)
      );
      existingTagFilters = existingTagFilters.filter(t => callAnalysisBlacklistedTags.indexOf(t.name) === -1);
      setOrDeleteMatrixKey(
        params,
        analyze,
        `callList.${tagFilterMatrixParameter}`,
        getTagFilterToUrlString(existingTagFilters)
      );
    }

    const orderMatrixParameterPrefix = groupByTag == null || !isBlank(groupByTag.name) ? 'groups.' : 'rawItems.';
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

    if (metrics) {
      setOrDeleteMatrixKey(params, analyze, `groups.${metricsMatrixParameter}`, serializeMetrics(metrics));
    }

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }

    if (showGraph) {
      setOrDeleteMatrixKey(params, analyze, `groups.${showGraphMatrixParameter}`, showGraph);
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
