import { get, find } from 'lodash';
import React from 'react';

import { Td } from 'in-components/tables/sharedComponents';
import { number } from 'in-services/formatters/number';

export default function MetricColumnCells({ item, metrics, availableMetrics }) {
  return metrics.map(({ metric, aggregation }) => {
    const value = get(item, ['metrics', `${metric}_${aggregation}_Agg`, 0, 1]);
    let formatter = number.detailed;
    const metricDefinition = find(availableMetrics, m => m.metric === metric);
    if (metricDefinition) {
      formatter = metricDefinition.formatter.detailed;
    }

    return (
      <Td key={`${metric}_${aggregation}`} noWrap>
        <span>
          {value == null && 'N/A'}
          {value != null && formatter(value)}
        </span>
      </Td>
    );
  });
}
