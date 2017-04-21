import { create } from 'reactive-observables';
import invariant from 'invariant';
import React from 'react';

import SparkChartWithValue from 'in-components/Table/renderers/sparkChart/SparkChartWithValue';
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
    'Columns with type=sparkChart must have a getTimeWindowAggregation(row) => mean|count|adjustedCount|max function'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const value$ = create();
  const snapshotId = columnDefinition.typeArgs.getSnapshotId(row.rowConfig);
  const metric = columnDefinition.typeArgs.getMetricName(row.rowConfig);
  const formatter = columnDefinition.typeArgs.getContent;

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
      <SparkChartWithValue
        value$={value$}
        snapshotId={snapshotId}
        metric={metric}
        formatter={formatter}
        value={column.value}
      />
    );
  };

  column.subscription = getMetric({
    snapshotId,
    metric,
    timeWindowAggregation: columnDefinition.typeArgs.getTimeWindowAggregation(row.rowConfig)
  }).subscribe(v => {
    column.value = v;
    value$.emit(formatter(v, row.rowConfig));
    row.mutationCount++;
    emitRawDataChange();
  });

  return column;
}

export function refreshContent(row, column) {
  column.content = column.value;
}
