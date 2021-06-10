/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  tagFilters as tagFiltersMatrixParameterName,
  group as groupMatrixParameterName,
  metrics as metricsMatrixParameterName,
  beaconId as beaconIdMatrixParameterName,
  sessionId as sessionIdMatrixParameterName,
  beaconTimestamp as beaconTimestampMatrixParameterName
} from 'in-mobile-apps/navigation/matrix';
import {
  analyzePath,
  analyzePathFullyQualified,
  analyzeTwoParameters,
  sessionViewPath
} from 'in-mobile-apps/navigation/paths';
import { setOrDeleteMatrixKey, getMatrixParameter, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { deserializeTagFilters, deserializeMetrics } from 'in-mobile-apps/navigation/matrix';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { type } from 'in-components/QueryBuilder/transformation/tagFilter';

export function transformOneZeroToTwoZero(location, tagCatalog, metricCatalog, dataSourceConfiguration) {
  // In 1.0 zero mode the detail view has a different path. In 2.0 mode this difference
  // doesn't exist.
  location.pathname = analyzePathFullyQualified;

  transformDetailIdParameters(location);

  transformGroupByParameters(location);

  transformTagFiltersParameters(location, tagCatalog);

  transformOrderByParameters(location, metricCatalog);

  transformMetricParameters(location, dataSourceConfiguration);

  transformChartedMetricsParameters(location, dataSourceConfiguration);
}

function transformDetailIdParameters(location) {
  const sessionId = getMatrixParameter(location, sessionViewPath, sessionIdMatrixParameterName);
  const beaconId = getMatrixParameter(location, sessionViewPath, beaconIdMatrixParameterName);
  let beaconTimestamp = getMatrixParameter(location, sessionViewPath, beaconTimestampMatrixParameterName);
  if (beaconTimestamp) {
    beaconTimestamp = Number(beaconTimestamp);
  }
  if (sessionId) {
    const detailId = {
      sessionId,
      beaconTimestamp
    };
    if (beaconId) {
      detailId.beaconId = beaconId;
    }
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.detailId.path,
      analyzeTwoParameters.detailId.name,
      analyzeTwoParameters.detailId.serializer(detailId)
    );
  }

  // clear old session view parameters
  delete location.matrix['/session'];
  delete location.matrix['/summary'];
}

function transformGroupByParameters(location) {
  // Rename group => groupBy and remove old parameter. Structurally both parameters
  // are almost identical between UA1.0 and 2.0, except that in the latter version the
  // entity type 'NOT_APPLICABLE' should not be set.
  const groupByParam = getMatrixParameter(location, analyzePath, groupMatrixParameterName);
  let groupBy = analyzeTwoParameters.groupBy.parser(groupByParam);
  if (groupBy?.entity === NOT_APPLICABLE) {
    delete groupBy.entity;
  }
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, groupBy?.groupbyTag ? groupBy : null);
  // clear old grouping value
  setOrDeleteMatrixKey(location, analyzePath, groupMatrixParameterName);
}

function transformTagFiltersParameters(location, tagCatalog) {
  const tagFilters = getMatrixParameter(location, analyzePath, tagFiltersMatrixParameterName);
  setOrDeleteMatrixKey(location, analyzePath, tagFiltersMatrixParameterName);
  if (tagFilters) {
    const tagFilterExpression = fromTagFiltersArray(deserializeTagFilters(tagFilters), tagCatalog);
    tagFilterExpression.map(e => {
      // In UA2 entity type 'NOT_APPLICABLE' should not be set.
      if (e.type === type && e.entity === NOT_APPLICABLE) {
        delete e.entity;
      }
      return e;
    });
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.tagFilterExpression.path,
      analyzeTwoParameters.tagFilterExpression.name,
      analyzeTwoParameters.tagFilterExpression.serializer(tagFilterExpression)
    );
  }
}

function transformOrderByParameters(location, metricCatalog) {
  const direction = getMatrixParameter(location, analyzePath, 'orderDirection') || 'DESC';
  let by = getMatrixParameter(location, analyzePath, 'orderBy');
  setOrDeleteMatrixKey(location, analyzePath, 'orderDirection');
  if (by) {
    if (by.endsWith('_Agg')) {
      // This suffix is no longer used in the new format
      by = by.substring(0, by.length - 4);
    }

    const groupByParam = getMatrixParameter(
      location,
      analyzeTwoParameters.groupBy.path,
      analyzeTwoParameters.groupBy.name
    );
    const groupBy = analyzeTwoParameters.groupBy.parser(groupByParam);
    const isGrouped = Boolean(groupBy.groupbyTag);
    if (isGrouped) {
      if (by === 'timestamp') {
        by = 'earliestTimestamp';
      }
      if (by === 'count') {
        by = 'beaconCount_SUM';
      }
      const orderByGroups = {
        by,
        direction
      };
      setOrDeleteMatrixKey(location, analyzePath, 'orderBy');
      setOrDeleteMatrixKey(
        location,
        analyzeTwoParameters.orderByGroups.path,
        analyzeTwoParameters.orderByGroups.name,
        analyzeTwoParameters.orderByGroups.serializer(orderByGroups)
      );
    } else {
      const [metric] = by.split('_', 1);
      const metricDefinition = metricCatalog.find(({ metricId }) => metricId === metric);
      const orderBy = {
        by: metricDefinition?.tagName ?? metric,
        direction
      };
      setOrDeleteMatrixKey(
        location,
        analyzeTwoParameters.orderBy.path,
        analyzeTwoParameters.orderBy.name,
        analyzeTwoParameters.orderBy.serializer(orderBy)
      );
    }
  }
}

function transformMetricParameters(location, dataSourceConfiguration) {
  const metrics = getMatrixParameter(location, analyzePath, metricsMatrixParameterName);
  setOrDeleteMatrixKey(location, analyzePath, metricsMatrixParameterName);
  if (metrics) {
    const fixedFields = dataSourceConfiguration.fixedFields ?? [];
    const fields = deserializeMetrics(metrics)
      .map(eachMetric => ({
        type: metricType,
        metricId: eachMetric.metric,
        aggregationId: eachMetric.aggregation
      }))
      // filter out fixed fields
      .filter(
        m =>
          !fixedFields.some(f => f.type === m.type && f.metricId === m.metricId && f.aggregationId === m.aggregationId)
      );
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.fields.path,
      analyzeTwoParameters.fields.name,
      analyzeTwoParameters.fields.serializer(fields)
    );
  }
}

function transformChartedMetricsParameters(location, dataSourceConfiguration) {
  const focusedMetric = getMatrixParameter(location, analyzePath, 'focusedMetric');
  setOrDeleteMatrixKey(location, analyzePath, 'showGraph');
  setOrDeleteMatrixKey(location, analyzePath, 'focusedMetric');

  let chartedMetrics;
  // don't have to check showGraph value here as showGraph is always true for UA2
  if (focusedMetric) {
    const [metricId] = focusedMetric.split('_', 1);
    const aggregationId = focusedMetric.substring(metricId.length + 1);
    chartedMetrics = [{ metricId, aggregationId }];
  } else {
    chartedMetrics = dataSourceConfiguration.defaultChartedMetrics;
  }

  setOrDeleteMatrixKey(
    location,
    analyzeTwoParameters.chartedMetrics.path,
    analyzeTwoParameters.chartedMetrics.name,
    analyzeTwoParameters.chartedMetrics.serializer(chartedMetrics)
  );
}

export function isAnalyticsOneLocation(location) {
  return (
    !getMatrixParameter(
      location,
      analyzeTwoParameters.tagFilterExpression.path,
      analyzeTwoParameters.tagFilterExpression.name
    ) &&
    (!!getMatrixParameter(location, analyzePath, tagFiltersMatrixParameterName) ||
      !!getMatrixParameter(location, analyzePath, groupMatrixParameterName) ||
      !!getMatrixParameter(location, sessionViewPath, sessionIdMatrixParameterName))
  );
}
