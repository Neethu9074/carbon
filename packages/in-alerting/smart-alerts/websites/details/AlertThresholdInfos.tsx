/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

import React from 'react';

import {
  WebsiteAlertRule,
  Severity,
  SmartAlertThresholdRuleUnion,
  ThresholdOperator,
  AlertEvaluationType
} from 'in-types';
import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { mapToThresholdRuleInfo, ThresholdRuleInfo } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { ThresholdInfo } from 'in-alerting/smart-alerts/components/details/ThresholdInfo';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

interface Props {
  thresholdOperator: ThresholdOperator;
  thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion };
  rule: WebsiteAlertRule;
  evaluationType: AlertEvaluationType;
}

export const AlertThresholdInfos = ({ thresholdOperator, thresholdsMap, rule }: Props) => {
  const warningThresholdRule = thresholdsMap[WARNING_SEVERITY];
  const criticalThresholdRule = thresholdsMap[CRITICAL_SEVERITY];
  const threshold = criticalThresholdRule ?? warningThresholdRule;
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const thresholdRuleInfo: ThresholdRuleInfo = mapToThresholdRuleInfo(threshold as SmartAlertThresholdRuleUnion);
  const { type: thresholdType, seasonality } = thresholdRuleInfo;

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel =
    blueprintConfig.getThresholdTypeOptions().find(type => type.value === thresholdAndSeasonality)?.label ?? '';

  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName, aggregation);
  const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricLabel}
      scopeLabel={t('in-alerting:smartAlerts.websites.advanced.evaluationSwitch.evaluationTypePERWEBSITE.shortText')}
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
