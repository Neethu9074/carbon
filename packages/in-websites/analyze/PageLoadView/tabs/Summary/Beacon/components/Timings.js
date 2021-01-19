/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { latencyFixed, percentage as percentageFormatter } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './Timings.mless';

export default function Timings({ timings, totalDuration, totalDurationName }) {
  timings = timings.filter(({ value }) => value >= 0);

  return (
    <dl className={locals.timings}>
      {timings.map(({ label, value }, i) => {
        const percentage = Math.min(value / Math.max(0.01, totalDuration), 1);
        return (
          <div key={i} className={locals.timing}>
            <dt className={locals.label}>{label}</dt>
            <dd className={locals.value}>{latencyFixed.compact(value)}</dd>
            <Tooltip align="topMiddle" content={`${percentageFormatter.detailed(percentage)} of ${totalDurationName}`}>
              <div className={locals.indicator} style={{ width: `${100 * percentage}%` }} />
            </Tooltip>
          </div>
        );
      })}
    </dl>
  );
}
