/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { aggregationLabels, aggregationIcons } from 'in-stores/metric/metric';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AggregationSymbol.mless';

export default function AggregationSymbol({ aggregation }) {
  const label = aggregationLabels[aggregation] || aggregation.toLowerCase();

  if (aggregation.startsWith('P')) {
    return (
      <Tooltip content={label} align="mousePosition">
        <small className={locals.percentile}>
          {aggregation.substring(1)}
          <sup>th</sup>
        </small>
      </Tooltip>
    );
  }

  if (supportsAggregationIcon(aggregation)) {
    return (
      <Tooltip content={label} align="mousePosition">
        <SvgIcon className={locals.icon} type={aggregationIcons[aggregation]} size="xxs" />
      </Tooltip>
    );
  }

  return (
    <Tooltip content={label} align="mousePosition">
      <small className={locals.other}>{label}</small>
    </Tooltip>
  );
}

export function supportsAggregationIcon(aggregation) {
  return !!aggregationIcons[aggregation];
}
