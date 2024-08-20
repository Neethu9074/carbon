/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Pill } from '@instana/components';

import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './BatchIndicator.mless';

export default function BatchIndicator({ batchCount }) {
  if (batchCount == null || batchCount < 2) {
    return null;
  }

  const formattedNumber = number.compact(batchCount);
  return (
    <Tooltip content={`${formattedNumber} occurrences`}>
      <div>
        <Pill kind="lighter" className={locals.indicator}>
          {formattedNumber}
        </Pill>
      </div>
    </Tooltip>
  );
}
