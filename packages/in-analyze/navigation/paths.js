import {
  previewEnabled as previewEnabledMatrixParameter,
  orderDirection as orderDirectionMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  showGraph as showGraphMatrixParameter,
  orderBy as orderByMatrixParameter,
  traceId as traceIdMatrixParameter,
  groupBy as groupByMatrixParameter,
  metrics as metricsMatrixParameter,
  callId as callIdMatrixParameter,
  focusedMetric as focusedMetricMatrixParameter,
  serializeMetrics
} from 'in-analyze/navigation/matrix';
import { getTagFilterToUrlString, getGroupToUrlString, getTagFilterFromUrlString } from 'in-analyze/filterBuilder';
import { APPLICATION, APPLICATION_INBOUND, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { callAnalysisDisabledTags, traceAnalysisDisabledTags } from 'in-applications/tags';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
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
  showGraph = true,
  focusedMetric,
  jumpToSource,
  previewEnabled
} = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = analyze;

    if (dataSource != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${dataSourceMatrixParameter}`, dataSource);
    }

    if (groupByTag != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${groupByMatrixParameter}`, getGroupToUrlString(groupByTag));
    }

    if (previewEnabled) {
      setOrDeleteMatrixKey(params, analyze, `callList.${previewEnabledMatrixParameter}`, previewEnabled);
    }

    // Force lazy initialization of tagFilter so that we can differentiate between deliberate decision to reset filters
    // and just no desire to change filters.
    let tagFilter = null;
    if (applicationName != null) {
      tagFilter = tagFiltersForBoundaryScope(boundaryScope, applicationName);
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

    if (jumpToSource) {
      if (jumpToSource === 'application') {
        tagFilter = [];
        tagFilter.push({
          name: APPLICATION.name,
          value: applicationName,
          operator: operators.EQUALS,
          entity: entityTypes.SOURCE
        });
      }

      if (jumpToSource === 'service') {
        tagFilter = [];
        tagFilter.push({
          name: SERVICE.name,
          value: serviceName,
          operator: operators.EQUALS,
          entity: entityTypes.SOURCE
        });
      }
      if (jumpToSource === 'endpoint') {
        tagFilter = [];
        tagFilter.push({
          name: ENDPOINT.name,
          value: endpointName,
          operator: operators.EQUALS,
          entity: entityTypes.SOURCE
        });
      }
    }

    if (filters) {
      tagFilter = tagFilter || [];
      tagFilter.push(...filters);
    }

    if (tagFilter != null) {
      setOrDeleteMatrixKey(params, analyze, `callList.${tagFilterMatrixParameter}`, getTagFilterToUrlString(tagFilter));
    } else if (dataSource === 'calls' || dataSource === 'traces') {
      // remove disabled filters
      let existingTagFilters = getTagFilterFromUrlString(
        getMatrixParameter(params, analyze, `callList.${tagFilterMatrixParameter}`)
      );
      const disabledTags = dataSource === 'calls' ? callAnalysisDisabledTags : traceAnalysisDisabledTags;
      existingTagFilters = existingTagFilters.filter(t => disabledTags.indexOf(t.name) === -1);
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
      setOrDeleteMatrixKey(params, analyze, `callList.${showGraphMatrixParameter}`, showGraph);
    }

    if (focusedMetric) {
      setOrDeleteMatrixKey(params, analyze, `callList.${focusedMetricMatrixParameter}`, focusedMetric);
    }
  });
}

export function tagFiltersForBoundaryScope(boundaryScope, applicationName) {
  if (boundaryScope === boundaryScopes.all) {
    return [
      {
        name: APPLICATION.name,
        value: applicationName,
        operator: operators.EQUALS,
        entity: entityTypes.DESTINATION
      }
    ];
  }
  if (boundaryScope === boundaryScopes.inbound) {
    return [
      {
        name: APPLICATION_INBOUND.name,
        value: applicationName,
        operator: operators.EQUALS
      }
    ];
  }
  return [];
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
