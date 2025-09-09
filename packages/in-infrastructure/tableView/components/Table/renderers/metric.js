/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { just } from '@instana/observables';

import PercentageCell from 'in-infrastructure/tableView/components/Table/components/PercentageCell';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { percentage } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';

export const type = 'metric';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function' || typeof col.typeArgs.getSnapshotId$ === 'function',
    'Columns with type=metric must have a getSnapshotId(row) or getSnapshotId$(row) function.'
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
    'Columns with type=metric must have a getTimeWindowAggregation(row) => mean|sum|max function'
  );
  invariant(
    col.typeArgs.getFallbackContent == null || typeof col.typeArgs.getFallbackContent === 'function',
    'Columns with type=metric may define a getFallbackContent property of type function or not define the property at all'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange, metricSubscriptionQueue) {
  const column = {
    columnDefinition,
    columnIndex,
    value: null,
    subscription: null,
    comparator: compare,
    requiresContentRefresh: true
  };
  column.refreshContent = refreshContent.bind(null, row, column);

  let snapshotId$;
  if (columnDefinition.typeArgs.getSnapshotId) {
    snapshotId$ = just(columnDefinition.typeArgs.getSnapshotId(row.rowConfig));
  } else {
    snapshotId$ = columnDefinition.typeArgs.getSnapshotId$(row.rowConfig);
  }

  // Use the queue instance from content.js
  snapshotId$.once(snapshotId => {
    // Create a request object for the queue
    const request = {
      snapshotId,
      metric: columnDefinition.typeArgs.getMetricName(row.rowConfig),
      column,
      row,
      emitRawDataChange,
      timeWindowAggregation: columnDefinition.typeArgs.getTimeWindowAggregation(row.rowConfig),
      forceTimeWindowAggregation: columnDefinition.typeArgs.forceTimeWindowAggregation
    };

    // Enqueue the metric subscription request
    metricSubscriptionQueue.addMetricSubscription(request);
  });

  return column;
}

function refreshContent(row, column) {
  if (column.value == null) {
    const getFallbackContent = column.columnDefinition.typeArgs.getFallbackContent;
    const fallback = getFallbackContent ? getFallbackContent(row.rowConfig) : <LoadingSkeleton />;
    column.content = column.value === null ? fallback : valueMissingPlaceholder;
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
