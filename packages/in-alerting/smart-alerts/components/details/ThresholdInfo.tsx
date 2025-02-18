/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { CRITICAL_SEVERITY, WARNING_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { mapToThresholdRuleInfo } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { Severity, SmartAlertThresholdRuleUnion, ThresholdOperator } from 'in-types';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { NumberFormatter } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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

function getThresholdValueFromThresholdRule(rule: SmartAlertThresholdRuleUnion | undefined): number | undefined {
  if (!rule) return undefined;
  return mapToThresholdRuleInfo(rule).value;
}

interface ThresholdInfoProps {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  metricFormat: NumberFormatter;
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
