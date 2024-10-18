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
      <div>
        <Typography onDark variant="body-bold">
          {t('in-infrastructure:threshold.label')}
        </Typography>
      </div>
      <div>
        {threshold.critical && (
          <div>
            <Typography onDark variant="body-regular">
              {t('in-infrastructure:threshold.critical', {
                operator,
                level: threshold.critical
              })}
            </Typography>
          </div>
        )}
        {threshold.warning && (
          <div>
            <Typography onDark variant="body-regular">
              {t('in-infrastructure:threshold.warning', {
                operator,
                level: threshold.warning
              })}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}
