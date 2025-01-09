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
import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { NumberFormatter } from 'in-services/formatters/number';
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
  const formatter = getFormatter(entityType, metricName);
  const metricFormat: NumberFormatter = getMetricFormat(formatter);
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
