/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { t } from 'in-i18n';

export function updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
  const thresholdValueManuallyChanged = form.get('hiddenFields').get('thresholdValueManuallyChanged').value;

  if (calculateThresholdOnBackend) {
    thresholdOrBaselineLoadingSignal$.emit(false);

    const alertType = form.get('rule').get('alertType').value;
    const currentThreshold = form.get('threshold').toJS();

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

    const shouldAddNewThresholdData = simpleMode || !thresholdValueManuallyChanged;

    let updatedThresholdForm = createThresholdForm(
      {
        lastUpdated: time,
        ...(shouldAddNewThresholdData ? thresholdData : currentThreshold)
      },
      alertType
    );

    // preserve touched state on staticThreshold types
    if (data?.type === 'staticThreshold' && (thresholdValueManuallyChanged || shouldAddNewThresholdData)) {
      updatedThresholdForm = updatedThresholdForm.updateIn(['value'], f => f.setTouched(true));
    }

    let newForm = form
      .put('threshold', updatedThresholdForm)
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false));

    if (currentThreshold.value !== '') {
      newForm = newForm.updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(data?.value));
    }

    updateForm(newForm);
  }
}

export function changeFormDataByCopyState(isCopy, formData) {
  if (isCopy) {
    const changedFormData = {
      ...formData,
      name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: formData.name })
    };
    delete changedFormData.id;
    return changedFormData;
  }
  return formData;
}
