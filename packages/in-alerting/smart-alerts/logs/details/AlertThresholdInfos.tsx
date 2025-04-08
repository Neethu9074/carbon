/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Severity, SmartAlertThresholdRuleUnion, StaticThresholdRule, ThresholdOperator } from '@instana/types';
import { Stack } from '@instana/components';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface Props {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  metricLabel: string;
}

export const AlertThresholdInfos = ({ thresholdOperator, thresholdsMap, metricLabel }: Props) => {
  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}
      metricLabel={metricLabel}
      threshold={<ThresholdInfo thresholdsMap={thresholdsMap} thresholdOperator={thresholdOperator} />}
    />
  );
};

interface ThresholdInfoProps {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
}

export function ThresholdInfo({ thresholdOperator, thresholdsMap }: ThresholdInfoProps) {
  const warningThreshold = (thresholdsMap['WARNING'] as StaticThresholdRule)?.value;
  const criticalThreshold = (thresholdsMap['CRITICAL'] as StaticThresholdRule)?.value;
  const humanReadableOperator = humanReadableThresholdOperator(thresholdOperator);

  const warningThresholdLabel = t('in-alerting:smartAlerts.details.warningThresholdLabel');
  const criticalThresholdLabel = t('in-alerting:smartAlerts.details.criticalThresholdLabel');

  return (
    <Stack gap="xxsmall">
      {!isEmpty(warningThreshold) && (
        <div>{getFormattedThresholdValue(warningThresholdLabel, humanReadableOperator, warningThreshold!)}</div>
      )}
      {!isEmpty(criticalThreshold) && (
        <div>{getFormattedThresholdValue(criticalThresholdLabel, humanReadableOperator, criticalThreshold!)}</div>
      )}
    </Stack>
  );
}

function getFormattedThresholdValue(thresholdLabel: string, humanReadableOperator: string, threshold: number) {
  const formattedValue = threshold
    ? threshold !== Math.floor(threshold)
      ? number.forcedDetailed.detailed(threshold)
      : number.forcedCompact.detailed(threshold)
    : 0;
  return `${thresholdLabel}: ${humanReadableOperator} ${formattedValue}`;
}
