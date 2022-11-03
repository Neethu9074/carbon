/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getLatencySelectionFromTagFilterExpression,
  updateLatencySelection
} from 'in-applications/analyze/utils/latencyUtils';
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-applications/subscriptions/getLatencyDistributionBase10';
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
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
  fastQueryModeEnabled
}) {
  const timeConfig = useTimeConfig();
  const latencyTag = dataSourceConstants[dataSource].latencyTag;
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: latencyTag
  });
  const subscription = getLatencyDistributionBase10({
    includePercentiles: true,
    filter: { timeConfig },
    tagFilterExpression: backendQuery,
    includeInternal: hiddenCalls?.includeInternal,
    includeSynthetic: hiddenCalls?.includeSynthetic,
    dataSource: dataSourceConstants[dataSource].backendDataSource,
    queryPrecision: fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL'
  });

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
