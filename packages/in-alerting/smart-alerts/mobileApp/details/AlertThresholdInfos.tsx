/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { MobileAppAlertRule, ThresholdConfig, StaticThresholdConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  threshold: ThresholdConfig & StaticThresholdConfig;
  rule: MobileAppAlertRule;
}

export const AlertThresholdInfos = ({ threshold, rule }: Props) => {
  const { operator, type: thresholdType, value } = threshold;
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);

  const thresholdAndSeasonality = thresholdType;
  const thresholdTypeLabel =
    blueprintConfig.getThresholdTypeOptions().find(type => type.value === thresholdAndSeasonality)?.label ?? '';

  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName, aggregation);
  const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);
  const metricWithThresholdLabel = createMetricWithThresholdLabel(
    metricLabel,
    thresholdType,
    value,
    metricFormat,
    operator
  );

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricWithThresholdLabel}
      scopeLabel={t(
        'in-alerting:smartAlerts.mobileApp.alertDetails.evaluationSwitch.evaluationTypePerMobileApp.shortText'
      )}
    />
  );
};
