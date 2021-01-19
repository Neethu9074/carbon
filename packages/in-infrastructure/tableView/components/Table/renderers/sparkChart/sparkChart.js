/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';
import React from 'react';

import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import { compare } from 'in-services/util/number';
import { getMetric } from 'in-stores/metric';

export const type = 'sparkChart';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function',
    'Columns with type=sparkChart must have a getSnapshotId(row) function.'
  );
  invariant(
    typeof col.typeArgs.getMetricName === 'function',
    'Columns with type=sparkChart must have a getMetricName(row) function.'
  );
  invariant(
    typeof col.typeArgs.getContent === 'function',
    'Columns with type=sparkChart must have a getContent(value, row) function'
  );
  invariant(
    typeof col.typeArgs.getTimeWindowAggregation === 'function',
    'Columns with type=sparkChart must have a getTimeWindowAggregation(row) => mean|sum|max function'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const snapshotId = columnDefinition.typeArgs.getSnapshotId(row.rowConfig);
  const metric = columnDefinition.typeArgs.getMetricName(row.rowConfig);
  const formatter = columnDefinition.typeArgs.getContent;
  const timeWindowAggregation = columnDefinition.typeArgs.getTimeWindowAggregation(row.rowConfig);

  const column = {
    columnDefinition,
    columnIndex,
    value: null,
    subscription: null,
    comparator: compare,
    content: null
  };

  column.refreshContent = () => {
    column.content = (
      <HistoricMetricSparkChart
        snapshotId={snapshotId}
        metric={metric}
        formatter={formatter}
        value={column.value}
        aggregation={timeWindowAggregation}
        horizontalMetricValue={column.value != null ? formatter(column.value) : null}
      />
    );
  };

  column.subscription = getMetric({
    snapshotId,
    metric,
    timeWindowAggregation,
    // this flag enforces the metric subscription to always use the time window aggregated metric values
    forceTimeWindowAggregation: columnDefinition.typeArgs.forceTimeWindowAggregation
  }).subscribe(v => {
    if (column.value !== v) {
      column.value = v;
      column.requiresContentRefresh = true;
      row.mutationCount++;
      emitRawDataChange();
    }
  });

  return column;
}
