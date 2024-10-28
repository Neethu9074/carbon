/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import { humanReadableThresholdOperator } from 'in-components/Threshold/threshold';
import { FormatterFn } from 'in-stores/metric/formatters';
import { Threshold } from 'in-types';
import { t } from 'in-i18n';

export interface ThresholdTooltipProps {
  threshold: Threshold;
  formatter: FormatterFn;
}
export default function ThresholdTooltip({ threshold, formatter }: ThresholdTooltipProps) {
  if (!threshold || !threshold.thresholdEnabled || !threshold.operator || (!threshold.critical && !threshold.warning))
    return null;
  const operator = humanReadableThresholdOperator.get(threshold.operator);
  return (
    <>
      <Typography onDark variant="body-bold" component="div">
        {t('in-infrastructure:threshold.label')}
      </Typography>
      {threshold.critical && (
        <Typography onDark variant="body-regular" component="div">
          {t('in-infrastructure:threshold.critical', {
            operator,
            level: formatter(parseFloat(threshold.critical))
          })}
        </Typography>
      )}
      {threshold.warning && (
        <Typography onDark variant="body-regular" component="div">
          {t('in-infrastructure:threshold.warning', {
            operator,
            level: formatter(parseFloat(threshold.warning))
          })}
        </Typography>
      )}
    </>
  );
}
