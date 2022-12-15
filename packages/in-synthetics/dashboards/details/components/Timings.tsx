/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { latencyFixed, percentagePlain } from 'in-services/formatters/number';
import { Timing } from 'in-synthetics/utils/constants';
import Tooltip from 'in-components/Tooltip';

import locals from './Timings.mless';

interface TimingProps {
  timings: Timing[];
  duration: number;
}

export default function Timings({ timings, duration }: TimingProps) {
  return (
    <dl className={locals.timings}>
      {timings.map(({ label, value }: Timing, i: number) => {
        const percentage = (100 * (value < 0 ? 0 : value)) / duration;
        return (
          <div key={i} className={locals.timing}>
            <dt className={locals.label}>{label}</dt>
            <dd className={locals.value}>{latencyFixed.compact(value)}</dd>
            <Tooltip
              align="topMiddle"
              content={t(
                'in-synthetics:dashboard.detailsPage.subtransactionBody.timingsPercentageOfTotalDurationName',
                {
                  percentage: percentagePlain.detailed(percentage),
                  totalDurationName: 'response time'
                }
              )}
            >
              <div className={locals.indicatorContainer} style={{ width: `${duration}px` }}>
                <div className={locals.indicator} style={{ width: `${percentage}%` }} />
              </div>
            </Tooltip>
          </div>
        );
      })}
    </dl>
  );
}
