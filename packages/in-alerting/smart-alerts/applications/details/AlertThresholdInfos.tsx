/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  AlertEvaluationType,
  AggregationType,
  ApplicationAlertRule,
  ThresholdOperator,
  ThresholdType,
  ThresholdConfig,
  StaticThresholdConfig,
  AdaptiveBaselineConfig,
  HistoricBaselineConfig
} from 'in-types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import {
  ApplicationAlertType,
  getBlueprintConfig,
  MetricName
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { applicationThresholdTypeOptions } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/applications/details/AlertThresholdInfosPresenter';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

interface Props {
  threshold: ThresholdConfig & StaticThresholdConfig & AdaptiveBaselineConfig & HistoricBaselineConfig;
  rule: ApplicationAlertRule;
  evaluationType: AlertEvaluationType;
}

export const AlertThresholdInfos: React.FC<Props> = ({ threshold, rule, evaluationType }: Props) => {
  const { operator, type: thresholdType, seasonality, value } = threshold;
  const { alertType, aggregation, metricName } = rule;

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel = applicationThresholdTypeOptions.find(type => type.value === thresholdAndSeasonality)
    ?.label;

  const formattedMetricLabel = createMetricLabel(
    alertType,
    thresholdType,
    value,
    operator,
    metricName as MetricName,
    aggregation
  );
  const evaluationTypeLabel = alertEvaluationTypes[evaluationType]?.shortText;

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={formattedMetricLabel}
      scopeLabel={evaluationTypeLabel}
    />
  );
};

export function createMetricLabel(
  alertType: ApplicationAlertType,
  thresholdType: ThresholdType,
  value: number,
  operator: ThresholdOperator,
  metricName: MetricName,
  aggregation?: AggregationType
): string {
  const blueprintConfig = getBlueprintConfig(alertType);

  let formattedMetricLabel = blueprintConfig.getMetricLabel(metricName, aggregation);

  if (thresholdType === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName);
    const formattedValue = ((metricFormat as any).short || (metricFormat as any).compact)(value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    formattedMetricLabel += ` ${humanReadableOperator} ${formattedValue}`;
  }

  return formattedMetricLabel;
}
