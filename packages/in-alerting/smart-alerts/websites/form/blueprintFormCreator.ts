/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { WebsiteAlertRule, WebsiteTimeThresholdUnion } from '@instana/types';

// @ts-expect-error file will need to be converted to typescript
import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { getBlueprintConfig, WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createRuleWithThreshold } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';

type AlertThreshold = {
  operator?: string;
};

export default function createBlueprintForm(
  form: MapForm<any>,
  alertType: WebsitesAlertType,
  alertThreshold: AlertThreshold = {},
  isSimpleMode: boolean
) {
  const tagFilterExpression = (form.get('tagFilterExpression') as Field<FormModelElement[]>).value;
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const defaultOperator = alertThreshold?.operator || form.get('threshold').get('operator').value;
  const blueprintConfig = getBlueprintConfig(alertType)!;
  const thresholdType = warningThresholdField
    ? warningThresholdField.get('type').value
    : criticalThresholdField.get('type').value;
  let ruleWithThreshold = createRuleWithThreshold(
    warningThresholdField,
    criticalThresholdField,
    form.get('rule'),
    blueprintConfig.baselineEnabled,
    defaultOperator,
    isSimpleMode
  );

  const newThresholdForm: MapForm<any> = createThresholdForm(ruleWithThreshold, alertType);

  const metricName = blueprintConfig.defaultMetric;
  const newRuleForm = createRuleForm({
    ...((form.get('rule') as MapForm<any>).remove('operator').remove('value').toJS() as unknown as WebsiteAlertRule),
    alertType,
    metricName
  });

  // TODO when switching the blueprint, we currently do a cleanup based on the UI catalog. However, we should rely on
  //      the backend catalog instead. And then blueprintConfig.getAvailableTags(metricName) can be removed.
  const availableTagFilters = blueprintConfig.getAvailableTags(metricName);
  const backendModel = toBackendQueryModel(tagFilterExpression);
  const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);
  const filteredTagFilterExpression = fromBackendModel(cleanedUpExpression);

  let updatedForm = form
    .updateIn(['tagFilterExpression'], f => (f as Field<FormModelElement[]>).setValue(filteredTagFilterExpression))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold')!.toJS() as unknown as WebsiteTimeThresholdUnion;
  if (
    blueprintConfig.impactTimeThresholdDisabled &&
    timeThreshold.type === timeThresholdTypes.userImpactOfViolationsInSequence
  ) {
    // @ts-expect-error The if condition narrows the possible types here without using a typeguard
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold, thresholdType));
  }

  return updatedForm;
}
