/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { ThresholdConfigUnion, WebsiteAlertRule, WebsiteTimeThresholdUnion } from '@instana/types';

// @ts-expect-error file will need to be converted to typescript
import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { getBlueprintConfig, WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { HistoricBaselineConfig, StaticThresholdConfig } from 'in-types';

export default function createBlueprintForm(
  form: MapForm<any>,
  alertType: WebsitesAlertType,
  alertThreshold = {},
  isSimpleMode: boolean
) {
  const threshold = (form.get('threshold') as MapForm<any>).toJS() as unknown as ThresholdConfigUnion;
  const tagFilterExpression = (form.get('tagFilterExpression') as Field<FormModelElement[]>).value;

  const blueprintConfig = getBlueprintConfig(alertType)!;

  const newThresholdForm: MapForm<any> = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      // In simple mode, user does not have a choice to change threshold type, so we need to set it to HISTORIC_BASELINE
      // when user select a blueprint which has baseline enabled!
      type: blueprintConfig.baselineEnabled ? (isSimpleMode ? HISTORIC_BASELINE : threshold.type) : STATIC_THRESHOLD
    } as HistoricBaselineConfig | StaticThresholdConfig,
    // while the alertType and the Type of thresholdConfig are not combined in a parent Alert Config, this is
    // currently a too complicated typing, and will need further refactoring and improving!
    alertType
  );

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
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold, threshold.type));
  }

  return updatedForm;
}
