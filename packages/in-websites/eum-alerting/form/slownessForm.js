import { createField, notBlankValidator } from 'formalistic';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export function withSlownessFormStaticThreshold(form, threshold, rule) {
  let updatedForm = form;

  updatedForm = removeCommonFields(updatedForm);

  updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
  updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);

  updatedForm = addFieldsContainedInBoth(updatedForm, rule, threshold);

  return updatedForm;
}

export function withSlownessFormHistoricBaseline(form, threshold, rule) {
  let updatedForm = form;

  updatedForm = removeCommonFields(updatedForm);

  updatedForm = updatedForm.remove(fieldNames.ruleOperator);

  updatedForm = addFieldsContainedInBoth(updatedForm, rule, threshold);

  updatedForm = updatedForm
    .put(
      fieldNames.thresholdBaseline,
      createField({
        value: threshold && threshold.baseline
      })
    )
    .put(
      fieldNames.thresholdDeviationFactor,
      createField({
        value: (threshold && threshold.deviationFactor) || 2
      })
    );

  return updatedForm;
}

function addFieldsContainedInBoth(form, rule, threshold) {
  return form
    .put(
      fieldNames.ruleAggregation,
      createField({
        value: (rule && rule.aggregation) || 'P90',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdSeasonality,
      createField({
        value: (threshold && threshold.seasonality) || 'WEEKLY',
        validator: notBlankValidator
      })
    );
}

function removeCommonFields(updatedForm) {
  updatedForm = updatedForm.remove(fieldNames.ruleOperator);
  updatedForm = updatedForm.remove(fieldNames.ruleValue);
  return updatedForm;
}
