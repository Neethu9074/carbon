/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertRuleUnion, StaticThresholdConfig, ThresholdConfigUnion } from '@instana/types';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { t } from 'in-i18n';

interface Props {
  threshold: ThresholdConfigUnion & StaticThresholdConfig;
  rule: InfraAlertRuleUnion;
}

export const AlertThresholdInfos = ({ threshold, rule }: Props) => {
  const { operator, type: thresholdType, value } = threshold;
  const { metricName, entityType, aggregation } = rule;

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const metricFormat = getMetricFormat();
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
