import { createField, notBlankValidator } from 'formalistic';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export function withSlownessFormStaticThreshold(form, threshold) {
  let updatedForm = form;

  updatedForm = removeCommonFields(updatedForm);

  updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
  updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);

  updatedForm = addFieldsContainedInBoth(updatedForm, threshold);

  return updatedForm;
}

export function withSlownessFormHistoricBaseline(form, threshold) {
  let updatedForm = form;

  updatedForm = removeCommonFields(updatedForm);

  updatedForm = addFieldsContainedInBoth(updatedForm, threshold);

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
        value: (threshold && threshold.deviationFactor) || 4
      })
    );

  return updatedForm;
}

function addFieldsContainedInBoth(form, threshold) {
  if (!form.containsKey(fieldNames.thresholdSeasonality)) {
    form = form.put(
      fieldNames.thresholdSeasonality,
      createField({
        value: (threshold && threshold.seasonality) || 'DAILY',
        validator: notBlankValidator
      })
    );
  }

  return form;
}

function removeCommonFields(updatedForm) {
  return updatedForm;
}
