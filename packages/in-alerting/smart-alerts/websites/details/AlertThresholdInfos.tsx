/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  WebsiteAlertRule,
  ThresholdConfig,
  StaticThresholdConfig,
  AdaptiveBaselineConfig,
  HistoricBaselineConfig
} from 'in-types';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { t } from 'in-i18n';

interface Props {
  threshold: ThresholdConfig & StaticThresholdConfig & AdaptiveBaselineConfig & HistoricBaselineConfig;
  rule: WebsiteAlertRule;
}

export const AlertThresholdInfos = ({ threshold, rule }: Props) => {
  const { operator, type: thresholdType, seasonality, value } = threshold;
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
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
      scopeLabel={t('in-alerting:smartAlerts.websites.advanced.evaluationSwitch.evaluationTypePERWEBSITE.shortText')}
    />
  );
};
