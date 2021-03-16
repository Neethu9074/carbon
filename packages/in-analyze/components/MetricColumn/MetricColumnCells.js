/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get, find } from 'lodash';
import React from 'react';

import { Td } from 'in-components/tables/sharedComponents';
import { number } from 'in-services/formatters/number';

export default function MetricColumnCells({ item, metrics, availableMetrics }) {
  return metrics.map(({ metric, aggregation }) => {
    const value = get(item, ['metrics', `${metric}_${aggregation}_Agg`, 0, 1]);
    const formatter = find(availableMetrics, m => m.metric === metric)?.formatter.detailed ?? number.detailed;
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
