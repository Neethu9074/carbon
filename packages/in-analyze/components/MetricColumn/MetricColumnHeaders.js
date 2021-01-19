/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find } from 'lodash';
import React from 'react';

import SortableColumn from 'in-analyze/components/SortableColumn';
import { aggregationLabels } from 'in-stores/metric/metric';

export default function MetricColumnHeaders({ orderBy, orderDirection, onChangeOrder, metrics, availableMetrics }) {
  return metrics.map(({ metric, aggregation }) => {
    let label = `${metric} (${aggregation})`;
    const metricDefinition = find(availableMetrics, m => m.metric === metric);
    if (metricDefinition) {
      label = metricDefinition.label;

      if (metricDefinition.supportedAggregations.length > 1) {
        label += ` (${aggregationLabels[aggregation]})`;
      }
    }

    return (
      <SortableColumn
        key={`${metric}_${aggregation}`}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChangeOrder={onChangeOrder}
        defaultDirection="DESC"
        technicalName={`${metric}_${aggregation}_Agg`}
        label={label}
        noWrap
      />
    );
  });
}
