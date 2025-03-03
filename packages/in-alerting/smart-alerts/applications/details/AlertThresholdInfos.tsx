/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

import React from 'react';

import {
  AlertEvaluationType,
  Severity,
  ApplicationAlertRuleUnion,
  SmartAlertThresholdRuleUnion,
  ThresholdOperator
} from 'in-types';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { ThresholdInfo } from 'in-alerting/smart-alerts/components/details/ThresholdInfo';
import { mapToThresholdRuleInfo } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

interface Props {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  rule: ApplicationAlertRuleUnion;
  evaluationType: AlertEvaluationType;
}

export const AlertThresholdInfos = ({ thresholdOperator, thresholdsMap, rule, evaluationType }: Props) => {
  const warningThresholdRule = thresholdsMap[WARNING_SEVERITY];
  const criticalThresholdRule = thresholdsMap[CRITICAL_SEVERITY];
  const threshold = criticalThresholdRule ?? warningThresholdRule;
  const thresholdRuleInfo = mapToThresholdRuleInfo(threshold as SmartAlertThresholdRuleUnion);
  const { type: thresholdType, seasonality } = thresholdRuleInfo;
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel =
    blueprintConfig.getThresholdTypeOptions().find(type => type.value === thresholdAndSeasonality)?.label ?? '';

  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName, aggregation);
  const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);
  const evaluationTypeLabel = alertEvaluationTypes[evaluationType]?.shortText;
  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricLabel}
      scopeLabel={evaluationTypeLabel}
      {...(thresholdType === STATIC_THRESHOLD && {
        threshold: (
          <ThresholdInfo
            thresholdsMap={thresholdsMap}
            thresholdOperator={thresholdOperator}
            metricFormat={metricFormat}
          />
        )
      })}
    />
  );
};
