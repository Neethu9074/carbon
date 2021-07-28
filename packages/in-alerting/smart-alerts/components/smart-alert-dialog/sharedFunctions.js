/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

export function updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode) {
  thresholdOrBaselineLoadingSignal$.emit(false);

  const alertType = form.get('rule').get('alertType').value;
  const thresholdForm = form.get('threshold');
  const currentThreshold = thresholdForm.toJS();

  let thresholdData;
  if (errors.length === 0) {
    thresholdData = {
      ...currentThreshold,
      ...data
    };
  } else {
    // set empty baseline in case of error
    thresholdData = {
      ...currentThreshold,
      baseline: []
    };
  }

  let updatedThresholdForm = createThresholdForm(
    {
      lastUpdated: time,
      ...(shouldAddNewThresholdData(simpleMode, thresholdForm) ? thresholdData : currentThreshold)
    },
    alertType
  );

  // preserve touched state on staticThreshold types
  // we need to do this because, createThresholdForm discards all touched states from the threshold form
  // and because we use the touched state to decide if we should overwrite the current threshold input with new suggestions
  // automatically
  if (data?.type === STATIC_THRESHOLD && thresholdForm.containsKey('value')) {
    const oldState = thresholdForm.get('value').touched;
    updatedThresholdForm = updatedThresholdForm.updateIn(['value'], f => f.setTouched(oldState));
  }

  let newForm = form
    .put('threshold', updatedThresholdForm)
    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false))
    .updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(data?.value));

  updateForm(newForm);
}

export function duplicateAlertConfig(config) {
  const duplicatedConfig = {
    ...config,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
  delete duplicatedConfig.id;
  return duplicatedConfig;
}

/**
 * Apply editMode to form state. We use the touched state of the value and baseline fields to indicate if they should be
 * updated with new suggestions.
 */
export function applyEditMode(form, editMode) {
  if (!editMode) return form;

  const type = form.get('threshold').get('type').value;

  if (type === STATIC_THRESHOLD) {
    return form
      .updateIn(['threshold', 'value'], f => f.setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true)); // request update to show a new suggestion
  }
  return form.updateIn(['threshold', 'baseline'], f => f.setTouched(true));
}

function shouldAddNewThresholdData(simpleMode, thresholdForm) {
  if (simpleMode) return true;

  const type = thresholdForm?.get('type')?.value;
  if (type === STATIC_THRESHOLD) {
    return !thresholdForm?.get('value')?.touched;
  }
  return !thresholdForm?.get('baseline')?.touched;
}
