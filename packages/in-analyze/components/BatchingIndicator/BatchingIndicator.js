/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './BatchingIndicator.mless';

export default function BatchingIndicator({ batchCount, tooltipContent, tooltipAlign, noTopPosition }) {
  if (batchCount == null || batchCount < 2) {
    return null;
  }

  return (
    <Tooltip content={tooltipContent} align={tooltipAlign}>
      <Pill
        kind="lighter"
        className={classNames({
          [locals.pill]: true,
          [locals.noTopPosition]: noTopPosition
        })}
      >
        {number.compact(batchCount)}
      </Pill>
    </Tooltip>
  );
}
