/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { just } from '@instana/observables';

import {
  getLatencySelectionFromTagFilterExpression,
  updateLatencySelection
} from 'in-applications/analyze/utils/latencyUtils';
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistribution from 'in-applications/subscriptions/getLatencyDistribution';
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function LatencyDistributionChart({
  dataSource,
  tagFilterExpression,
  facets,
  facetedSearchItems,
  formModel,
  hiddenCalls,
  updateFilter,
  title,
  aggregation,
  showHeader,
  fastQueryModeEnabled,
  groupBy,
  chartableDataSeries
}) {
  const timeConfig = useTimeConfig();
  const latencyTag = dataSourceConstants[dataSource].latencyTag;
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: latencyTag
  });
  const hasGrouping = groupBy && Object.keys(groupBy).length ? true : false;
  const subscription = useMemo(() => {
    if (hasGrouping && !chartableDataSeries) {
      return just(pendingResult);
    } else {
      return getLatencyDistribution({
        includePercentiles: true,
        filter: { timeConfig },
        tagFilterExpression: backendQuery,
        includeInternal: hiddenCalls?.includeInternal,
        includeSynthetic: hiddenCalls?.includeSynthetic,
        dataSource: dataSourceConstants[dataSource].backendDataSource,
        queryPrecision: fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL',
        ...(hasGrouping &&
          chartableDataSeries && { grouping: { ...groupBy, groups: chartableDataSeries.map(i => i.label) } })
      });
    }
  }, [
    backendQuery,
    chartableDataSeries,
    dataSource,
    fastQueryModeEnabled,
    groupBy,
    hasGrouping,
    hiddenCalls?.includeInternal,
    hiddenCalls?.includeSynthetic,
    timeConfig
  ]);
  return (
    <LatencyDistributionBase10Chart
      subscription={subscription}
      selection={getLatencySelectionFromTagFilterExpression(dataSource, tagFilterExpression)}
      showPercentileMenu
      selectionAdjustable
      dataSource={dataSource}
      title={title}
      aggregation={aggregation}
      showHeader={showHeader}
      fastQueryModeEnabled={fastQueryModeEnabled}
      chartableDataSeries={chartableDataSeries}
      isGrouped={hasGrouping}
      onSelectionChanged={selection =>
        updateLatencySelection({
          dataSource: dataSource,
          facets,
          selection,
          updateFilter
        })
      }
    />
  );
}
