/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';

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

    const shouldAddNewThresholdData =
      simpleMode ||
      currentThreshold.value == null ||
      data?.type === 'historicBaseline' ||
      !thresholdValueManuallyChanged;

    const updatedThresholdForm = createThresholdForm(
      {
        lastUpdated: time,
        ...(shouldAddNewThresholdData ? thresholdData : currentThreshold)
      },
      alertType
    );

    let newForm = form
      .put('threshold', updatedThresholdForm)
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false));

    if (currentThreshold.value !== '') {
      newForm = newForm.updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(data?.value));
    }

    updateForm(newForm);
  }
}
