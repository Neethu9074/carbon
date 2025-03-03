/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import {
  MobileAppAlertRuleUnion,
  RuleWithThreshold,
  Severity,
  ThresholdType,
  WebsiteAlertConfigWithMetadata,
  WebsiteAlertRuleUnion
} from 'in-types';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { CRITICAL_SEVERITY, WARNING_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

type EumAlertConfigWithRules<T> = Omit<T, 'tagFilterExpression'> & {
  tagFilterExpression: FormModelElement[];
};

export function extractAlertConfigWithFormModel(
  ruleWithThreshold: RuleWithThreshold<MobileAppAlertRuleUnion | WebsiteAlertRuleUnion>
) {
  const { thresholds, rule } = ruleWithThreshold;
  const definedThresholdType = thresholds[WARNING_SEVERITY]?.type ?? thresholds[CRITICAL_SEVERITY]?.type;
  return {
    alertType: rule.alertType,
    definedThresholdType,
    metricName: rule.metricName
  };
}

export function getErrorMessage(queryError: boolean) {
  if (queryError) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
  return;
}

export default function toAlertConfigWithRules<T>(form: MapForm<any>): EumAlertConfigWithRules<T> {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const ruleWithThreshold = getRuleWithThreshold(form);
  const baseline = thresholdType === ADAPTIVE_BASELINE ? form.get('threshold').get('baseline')?.value : [];

  let alertConfig: any = form.remove('threshold').toJS();
  alertConfig.rules = [ruleWithThreshold];

  if (thresholdType === ADAPTIVE_BASELINE && baseline) {
    if (alertConfig.rules[0].thresholds.WARNING) {
      alertConfig.rules[0].thresholds.WARNING.baseline = baseline;
    }
    if (alertConfig.rules[0].thresholds.CRITICAL) {
      alertConfig.rules[0].thresholds.CRITICAL.baseline = baseline;
    }
  }

  return alertConfig as EumAlertConfigWithRules<T>;
}

/**
 * wrapper method to call generics method in a non-typescript file
 * @param form
 * @returns
 */
export function toAlertWebsiteConfigWithRules(
  form: MapForm<any>
): EumAlertConfigWithRules<WebsiteAlertConfigWithMetadata> {
  return toAlertConfigWithRules<WebsiteAlertConfigWithMetadata>(form);
}

function getRuleWithThreshold(form: MapForm<any>) {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const thresholdType = warningThresholdField?.get('type')?.value ?? criticalThresholdField?.get('type')?.value;

  const warningThreshold = getThresholdData(thresholdType, warningThresholdField, WARNING_SEVERITY);
  const criticalThreshold = getThresholdData(thresholdType, criticalThresholdField, CRITICAL_SEVERITY);

  const ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

export function getThresholdData(thresholdType: ThresholdType, thresholdField: MapForm<any>, severity: Severity) {
  if (
    thresholdType === HISTORIC_BASELINE ||
    thresholdType === ADAPTIVE_BASELINE ||
    thresholdType === STATIC_THRESHOLD
  ) {
    return thresholdField.get('isCheckboxSelected')?.value ? { [severity]: thresholdField.toJS() } : { [severity]: {} };
  }

  return {};
}
