/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { StaticThresholdConfig, ThresholdConfigUnion } from '@instana/types';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface Props {
  threshold: ThresholdConfigUnion & StaticThresholdConfig;
  metricLabel: string;
}

export const AlertThresholdInfos = ({ threshold, metricLabel }: Props) => {
  const { operator, type: thresholdType, value } = threshold;

  const metricFormat = number.forcedCompact;

  const metricWithThresholdLabel = createMetricWithThresholdLabel(
    metricLabel,
    thresholdType,
    value,
    metricFormat,
    operator
  );

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}
      metricLabel={metricWithThresholdLabel}
      scopeLabel={''}
    />
  );
};
