/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  AlertEvaluationType,
  ApplicationAlertRule,
  ThresholdConfig,
  StaticThresholdConfig,
  AdaptiveBaselineConfig,
  HistoricBaselineConfig
} from 'in-types';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

interface Props {
  threshold: ThresholdConfig & StaticThresholdConfig & AdaptiveBaselineConfig & HistoricBaselineConfig;
  rule: ApplicationAlertRule;
  evaluationType: AlertEvaluationType;
}

export const AlertThresholdInfos = ({ threshold, rule, evaluationType }: Props) => {
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
  const evaluationTypeLabel = alertEvaluationTypes[evaluationType]?.shortText;
  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricWithThresholdLabel}
      scopeLabel={evaluationTypeLabel}
    />
  );
};
