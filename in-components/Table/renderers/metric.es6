import invariant from 'invariant';
import React from 'react';

import PercentageCell from 'in-components/Table/components/PercentageCell';
import { percentage } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import { getMetric } from 'in-stores/metric';

export const type = 'metric';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function',
    'Columns with type=metric must have a getSnapshotId(row) function.'
  );
  invariant(
    typeof col.typeArgs.getMetricName === 'function',
    'Columns with type=metric must have a getMetricName(row) function.'
  );
  invariant(
    typeof col.typeArgs.getContent === 'function',
    'Columns with type=metric must have a getContent(value, row) function'
  );
  invariant(
    typeof col.typeArgs.getTimeWindowAggregation === 'function',
    'Columns with type=metric must have a getTimeWindowAggregation(row) => mean|count|adjustedCount|max function'
  );
  invariant(
    col.typeArgs.getFallbackContent == null || typeof col.typeArgs.getFallbackContent === 'function',
    'Columns with type=metric may define a getFallbackContent property of type function or not define the property at all'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const column = {
    columnDefinition,
    columnIndex,
    value: null,
    subscription: null,
    comparator: compare,
    requiresContentRefresh: true
  };
  column.refreshContent = refreshContent.bind(null, row, column);

  column.subscription = getMetric({
    snapshotId: columnDefinition.typeArgs.getSnapshotId(row.rowConfig),
    metric: columnDefinition.typeArgs.getMetricName(row.rowConfig),
    timeWindowAggregation: columnDefinition.typeArgs.getTimeWindowAggregation(row.rowConfig),

    // this flag enforces the metric subscription to always use the time window aggregated metric values
    forceTimeWindowAggregation: columnDefinition.typeArgs.forceTimeWindowAggregation
  }).subscribe(v => {
    column.value = v;
    column.requiresContentRefresh = true;
    row.mutationCount++;
    emitRawDataChange();
  });

  return column;
}

function refreshContent(row, column) {
  if (column.value == null) {
    const getFallbackContent = column.columnDefinition.typeArgs.getFallbackContent;
    const fallback = getFallbackContent ? getFallbackContent(row.rowConfig) : null;
    column.content = fallback;
    return;
  }

  const content = column.columnDefinition.typeArgs.getContent(column.value, row.rowConfig);
  if (shouldPresentValueAsPercentage(column.columnDefinition.typeArgs.getContent)) {
    column.content = <PercentageCell value={column.value} content={content} />;
  } else {
    column.content = content;
  }
}

function shouldPresentValueAsPercentage(getContentFn) {
  return getContentFn === percentage.compact || getContentFn === percentage.detailed;
}
