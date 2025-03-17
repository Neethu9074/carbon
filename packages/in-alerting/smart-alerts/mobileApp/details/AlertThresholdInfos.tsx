/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { CRITICAL_SEVERITY, WARNING_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { mapToThresholdRuleInfo, ThresholdRuleInfo } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { MobileAppAlertRule, SmartAlertThresholdRuleUnion, Severity, ThresholdOperator } from 'in-types';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { ThresholdInfo } from 'in-alerting/smart-alerts/components/details/ThresholdInfo';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

interface Props {
  thresholdOperator: ThresholdOperator;
  rule: MobileAppAlertRule;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
}

export const AlertThresholdInfos = ({ thresholdOperator, thresholdsMap, rule }: Props) => {
  const warningThresholdRule = thresholdsMap[WARNING_SEVERITY];
  const criticalThresholdRule = thresholdsMap[CRITICAL_SEVERITY];
  const thresholdRule = criticalThresholdRule ?? warningThresholdRule;
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);

  const thresholdRuleInfo = mapToThresholdRuleInfo(thresholdRule as SmartAlertThresholdRuleUnion);
  const { type: thresholdType, seasonality }: ThresholdRuleInfo = thresholdRuleInfo;

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel =
    blueprintConfig.getThresholdTypeOptions().find(type => type.value === thresholdAndSeasonality)?.label ?? '';

  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName, aggregation);
  const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricLabel}
      scopeLabel={t(
        'in-alerting:smartAlerts.mobileApp.alertDetails.evaluationSwitch.evaluationTypePerMobileApp.shortText'
      )}
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
