/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { aggregationLabels, aggregationIcons, hasIcon } from 'in-stores/metric/metric';
import Tooltip from 'in-components/Tooltip';

import locals from './AggregationSymbol.mless';

export default function AggregationSymbol({ aggregation }) {
  const label = aggregationLabels[aggregation] || aggregation.toLowerCase();

  if (!hasIcon(aggregation)) {
    return null;
  }

  if (aggregation.startsWith('P') && aggregation.size === 3) {
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
