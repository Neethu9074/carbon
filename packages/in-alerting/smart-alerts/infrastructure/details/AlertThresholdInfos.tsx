/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertRuleUnion, StaticThresholdConfig, ThresholdConfigUnion } from '@instana/types';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { t } from 'in-i18n';

interface Props {
  threshold: ThresholdConfigUnion & StaticThresholdConfig;
  rule: InfraAlertRuleUnion;
  metricLabel: string;
}

export const AlertThresholdInfos = ({ threshold, rule, metricLabel }: Props) => {
  const { operator, type: thresholdType, value } = threshold;
  const { metricName, entityType } = rule;

  const formatter = getFormatter(entityType, metricName);
  const metricFormat = getMetricFormat(formatter);

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
