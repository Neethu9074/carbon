/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  AlertEvaluationType,
  Severity,
  ApplicationAlertRuleUnion,
  SmartAlertThresholdRuleUnion,
  StaticThresholdRule,
  StaticBaselineThresholdRule,
  AdaptiveThresholdRule,
  ThresholdOperator,
  Seasonality,
  ThresholdType
} from 'in-types';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { STATIC_THRESHOLD, HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { NumberFormatter } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
  const processedThreshold = mapThresholdRuleToFields(threshold as SmartAlertThresholdRuleUnion);
  const { type: thresholdType, seasonality } = processedThreshold;
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

interface ProcessedThreshold {
  type: ThresholdType;
  seasonality: Seasonality | null;
  value: number;
}

export function mapThresholdRuleToFields(rule: SmartAlertThresholdRuleUnion): ProcessedThreshold {
  switch (rule.type) {
    case STATIC_THRESHOLD:
      return {
        type: rule.type,
        seasonality: null,
        value: (rule as StaticThresholdRule).value
      };
    case HISTORIC_BASELINE:
      rule = rule as StaticBaselineThresholdRule;
      return {
        type: rule.type,
        seasonality: rule.seasonality,
        value: rule.deviationFactor
      };
    case ADAPTIVE_BASELINE:
      return {
        type: rule.type,
        seasonality: null,
        value: (rule as AdaptiveThresholdRule).deviationFactor
      };
    default:
      throw new Error(`Unknown threshold type`);
  }
}

interface ThresholdInfoProps {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  metricFormat: NumberFormatter;
}

function getThresholdValueFromThresholdRule(rule: SmartAlertThresholdRuleUnion | undefined): number | undefined {
  if (!rule) return undefined;
  return mapThresholdRuleToFields(rule).value;
}
export function ThresholdInfo({ thresholdOperator, thresholdsMap, metricFormat }: ThresholdInfoProps) {
  const warningThreshold = getThresholdValueFromThresholdRule(thresholdsMap[WARNING_SEVERITY]);
  const criticalThreshold = getThresholdValueFromThresholdRule(thresholdsMap[CRITICAL_SEVERITY]);
  const humanReadableOperator = humanReadableThresholdOperator(thresholdOperator);
  const warningThresholdLabel = t('in-alerting:smartAlerts.details.warningThresholdLabel');
  const criticalThresholdLabel = t('in-alerting:smartAlerts.details.criticalThresholdLabel');

  return (
    <Stack gap="xxsmall">
      {!isEmpty(warningThreshold) && (
        <div>
          {getFormattedThresholdValue(warningThresholdLabel, humanReadableOperator, metricFormat, warningThreshold!)}
        </div>
      )}
      {!isEmpty(criticalThreshold) && (
        <div>
          {getFormattedThresholdValue(criticalThresholdLabel, humanReadableOperator, metricFormat, criticalThreshold!)}
        </div>
      )}
    </Stack>
  );
}

function getFormattedThresholdValue(
  thresholdLabel: string,
  humanReadableOperator: string,
  metricFormat: NumberFormatter,
  threshold: number
) {
  const formattedValue = formatMetricValue(metricFormat, threshold);
  return `${thresholdLabel}: ${humanReadableOperator} ${formattedValue}`;
}
