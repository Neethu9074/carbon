/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { round } from 'lodash';
import React from 'react';

import { Typography } from '@instana/components';
import { Threshold } from '@instana/types';

import { humanReadableThresholdOperator } from 'in-components/Threshold/threshold';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export interface ThresholdTooltipProps {
  threshold: Threshold;
  formatter: FormatterFn;
  formatterId: string;
}
export default function ThresholdTooltip({ threshold, formatter, formatterId }: ThresholdTooltipProps) {
  if (!threshold || !threshold.thresholdEnabled || !threshold.operator) {
    return null;
  }

  const hasCritical = threshold.critical && threshold.critical.trim() !== '';
  const hasWarning = threshold.warning && threshold.warning.trim() !== '';

  if (!hasCritical && !hasWarning) {
    return null;
  }

  const operator = humanReadableThresholdOperator.get(threshold.operator);

  return (
    <>
      <Typography onDark variant="body-bold" component="div">
        {t('in-infrastructure:threshold.label')}
      </Typography>
      {hasCritical && (
        <Typography onDark variant="body-regular" component="div">
          {t('in-infrastructure:threshold.critical', {
            operator,
            level: getLevel(threshold.critical, formatter, formatterId)
          })}
        </Typography>
      )}
      {hasWarning && (
        <Typography onDark variant="body-regular" component="div">
          {t('in-infrastructure:threshold.warning', {
            operator,
            level: getLevel(threshold.warning, formatter, formatterId)
          })}
        </Typography>
      )}
    </>
  );
}

function getLevel(value: string, formatter: FormatterFn, formatterId: string) {
  let realValue = parseFloat(value);
  realValue = round(formatterId.startsWith('percentage') ? realValue / 100 : realValue, 2);
  return formatter(realValue);
}
