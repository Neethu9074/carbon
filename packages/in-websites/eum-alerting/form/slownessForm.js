import { createField, notBlankValidator } from 'formalistic';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export function withSlownessFormStaticThreshold(form, rule, threshold) {
  let updatedForm = form;

  updatedForm = removeCommonFields(updatedForm);

  updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
  updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);

  updatedForm = addFieldsContainedInBoth(updatedForm, rule, threshold);

  return updatedForm;
}

export function withSlownessFormHistoricBaseline(form, rule, threshold) {
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
  if (!form.containsKey(fieldNames.ruleAggregation)) {
    form = form.put(
      fieldNames.ruleAggregation,
      createField({
        value: (rule && rule.aggregation) || 'P90',
        validator: notBlankValidator
      })
    );
  }

  if (!form.containsKey(fieldNames.thresholdSeasonality)) {
    form = form.put(
      fieldNames.thresholdSeasonality,
      createField({
        value: (threshold && threshold.seasonality) || 'WEEKLY',
        validator: notBlankValidator
      })
    );
  }

  return form;
}

function removeCommonFields(updatedForm) {
  updatedForm = updatedForm.remove(fieldNames.ruleOperator);
  updatedForm = updatedForm.remove(fieldNames.ruleValue);
  return updatedForm;
}
