/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import { humanReadableThresholdOperator } from 'in-components/Threshold/threshold';
import { Threshold } from 'in-types';
import { t } from 'in-i18n';

export interface ThresholdTooltipProps {
  threshold: Threshold;
}
export default function ThresholdTooltip({ threshold }: ThresholdTooltipProps) {
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
            level: threshold.critical
          })}
        </Typography>
      )}
      {threshold.warning && (
        <Typography onDark variant="body-regular" component="div">
          {t('in-infrastructure:threshold.warning', {
            operator,
            level: threshold.warning
          })}
        </Typography>
      )}
    </>
  );
}
