/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  updateLatencySelection,
  getLatencySelectionFromTagFilterExpression
} from 'in-applications/analyze/utils/latencyUtils';
import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import {
  EMPTY_EXPRESSION,
  EXPRESSION,
  OPERATOR_AND
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function LatencyDistributionChart({ dataSource, tagFilterExpression, hiddenCalls, updateFilter }) {
  const latencyTag = dataSourceConstants[dataSource].latencyTag;
  const timeConfig = useTimeConfig();
  const subscription = getLatencyDistributionBase10({
    maxLatencyBuckets: 80,
    includePercentiles: true,
    filter: { timeConfig },
    tagFilterExpression: removeTopLevelFiltersFromExpression(
      tagFilterExpression,
      tagFilter => tagFilter.name === latencyTag
    ),
    includeInternal: hiddenCalls?.includeInternal,
    includeSynthetic: hiddenCalls?.includeSynthetic,
    dataSource: dataSourceConstants[dataSource].backendDataSource
  });

  return (
    <LatencyDistributionBase10Chart
      subscription={subscription}
      selection={getLatencySelectionFromTagFilterExpression(dataSource, tagFilterExpression)}
      showPercentileMenu
      selectionAdjustable
      dataSource={dataSource}
      onSelectionChanged={selection =>
        updateLatencySelection({
          dataSource: dataSource,
          selection,
          tagFilterExpression: tagFilterExpression,
          updateFilter: updateFilter
        })
      }
    />
  );
}

function removeTopLevelFiltersFromExpression(tagFilterExpression, predicate) {
  if (tagFilterExpression.type === EXPRESSION && tagFilterExpression.logicalOperator === OPERATOR_AND) {
    const filteredElements = tagFilterExpression.elements.filter(e => !predicate(e));
    if (filteredElements.length === 1) {
      return filteredElements[0];
    } else if (filteredElements.length > 1) {
      return { ...tagFilterExpression, elements: filteredElements };
    } else {
      return EMPTY_EXPRESSION;
    }
  } else if (tagFilterExpression.type === TAG_FILTER_TYPE && predicate(tagFilterExpression)) {
    return EMPTY_EXPRESSION;
  }
  return tagFilterExpression;
}
