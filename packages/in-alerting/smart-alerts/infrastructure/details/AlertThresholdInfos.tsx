/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  InfraAlertRuleUnion,
  Severity,
  SmartAlertThresholdRuleUnion,
  StaticThresholdRule,
  ThresholdOperator
} from '@instana/types';
import { Stack } from '@instana/components';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getMetricFormatter } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { NumberFormatter } from 'in-services/formatters/number';
import { getMetricDefinition } from 'in-sdk/metrics';
import { t } from 'in-i18n';

interface Props {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  rule: InfraAlertRuleUnion;
  metricLabel: string;
}

export const AlertThresholdInfos = ({ thresholdOperator, thresholdsMap, rule, metricLabel }: Props) => {
  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}
      metricLabel={metricLabel}
      threshold={<ThresholdInfo thresholdsMap={thresholdsMap} thresholdOperator={thresholdOperator} rule={rule} />}
      scopeLabel={''}
    />
  );
};

interface ThresholdInfoProps {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  rule: InfraAlertRuleUnion;
}

export function ThresholdInfo({ thresholdOperator, thresholdsMap, rule }: ThresholdInfoProps) {
  const warningThreshold = (thresholdsMap['WARNING'] as StaticThresholdRule)?.value;
  const criticalThreshold = (thresholdsMap['CRITICAL'] as StaticThresholdRule)?.value;
  const humanReadableOperator = humanReadableThresholdOperator(thresholdOperator);
  const { metricName, entityType } = rule;
  const metricDefinition = getMetricDefinition(entityType, metricName);
  const formatter = metricDefinition.formatter;
  const warningThresholdLabel = t('in-alerting:smartAlerts.details.warningThresholdLabel');
  const criticalThresholdLabel = t('in-alerting:smartAlerts.details.criticalThresholdLabel');

  return (
    <Stack gap="xxsmall">
      {!isEmpty(warningThreshold) && (
        <div>
          {getFormattedThresholdValue(warningThresholdLabel, humanReadableOperator, formatter, warningThreshold!)}
        </div>
      )}
      {!isEmpty(criticalThreshold) && (
        <div>
          {getFormattedThresholdValue(criticalThresholdLabel, humanReadableOperator, formatter, criticalThreshold!)}
        </div>
      )}
    </Stack>
  );
}

function getFormattedThresholdValue(
  thresholdLabel: string,
  humanReadableOperator: string,
  formatter: NumberFormatter,
  threshold: number
) {
  const formattedValue = getMetricFormatter(threshold, formatter, 'compact');
  return `${thresholdLabel}: ${humanReadableOperator} ${formattedValue}`;
}
