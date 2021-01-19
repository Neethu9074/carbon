/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './BatchIndicator.mless';

export default function BatchIndicator({ batchCount }) {
  if (batchCount == null || batchCount < 2) {
    return null;
  }

  const formattedNumber = number.compact(batchCount);
  return (
    <Tooltip content={`${formattedNumber} occurrences`}>
      <Pill kind="lighter" className={locals.indicator}>
        {formattedNumber}
      </Pill>
    </Tooltip>
  );
}
