/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { SkeletonPlaceholder } from '@carbon/react';
import React from 'react';

import { Typography } from '@instana/components';

import { t } from 'in-i18n';

import locals from './RootCauseBarChart.mless';

interface RootCauseBarChartProps {
  throughRCValue: number | null;
  notThroughRCValue: number | null;
}

export default function RootCauseBarChart({ throughRCValue, notThroughRCValue }: RootCauseBarChartProps) {
  // Format values for display or determine if they're N/A
  const isThroughRCValueNA = throughRCValue === null || isNaN(throughRCValue);
  const isNotThroughRCValueNA = notThroughRCValue === null || isNaN(notThroughRCValue);

  const throughRCFormatted = isThroughRCValueNA ? 'N/A' : throughRCValue.toFixed(2);
  const notThroughRCFormatted = isNotThroughRCValueNA ? 'N/A' : notThroughRCValue.toFixed(2);

  return (
    <div className={locals.container}>
      <Typography variant="heading-compact-01">{t('in-events:RCA.errorRates')}</Typography>
      <div className={locals.chartContent}>
        <div className={locals.barGroup}>
          <div className={locals.label}>
            <Typography variant="helper-text-01">{t('in-events:RCA.rootCause')}</Typography>
          </div>
          <div className={locals.barWrapper}>
            <div className={locals.axisLine} />
            <div className={locals.barContainer}>
              {isThroughRCValueNA ? (
                <SkeletonPlaceholder className={locals.skeletonBar} />
              ) : (
                <div className={locals.rootCauseBar} style={{ width: `${throughRCValue}%` }} />
              )}
              <div className={locals.valueLabel}>
                <Typography variant="label-01">{isThroughRCValueNA ? 'N/A' : `${throughRCFormatted}%`}</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className={locals.barGroup}>
          <div className={locals.label}>
            <Typography variant="helper-text-01">{t('in-events:RCA.otherEntities')}</Typography>
          </div>
          <div className={locals.barWrapper}>
            <div className={locals.axisLine} />
            <div className={locals.barContainer}>
              {isNotThroughRCValueNA ? (
                <SkeletonPlaceholder className={locals.skeletonBar} />
              ) : (
                <div className={locals.otherEntitiesBar} style={{ width: `${notThroughRCValue}%` }} />
              )}
              <div className={locals.valueLabel}>
                <Typography variant="label-01">
                  {isNotThroughRCValueNA ? 'N/A' : `${notThroughRCFormatted}%`}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
