/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { applicationType, availabilityType, websiteTimeBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { createMetricsForm, addGoodBadEventsForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import useFormSideEffects, { CHANGE_TYPES } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';

const formSideEffects = [
  {
    path: ['sliEntity', 'sliType'],
    effects: [resetFormForSliType]
  }
];

export default function useSliFormSideEffects(form, setForm) {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function resetFormForSliType(form) {
  let updatedForm = form;
  const sliType = form.get('sliEntity').get('sliType').value;
  if (sliType === applicationType || sliType === websiteTimeBased) {
    // Time Based SLIs
    updatedForm = updatedForm
      .put('metricConfiguration', createMetricsForm({}))
      .updateIn(['sliEntity'], f => f.remove('goodEventFilterExpression').remove('badEventFilterExpression'));
  } else {
    // Event Based SLIs
    updatedForm = updatedForm
      .remove('metricConfiguration')
      .updateIn(['sliEntity'], sliEntitySubForm => addGoodBadEventsForm(sliEntitySubForm));
  }

  if (sliType === availabilityType) {
    updatedForm = updatedForm
      .updateIn(['sliEntity', 'serviceId'], f => f.setValue(null).setTouched(true))
      .updateIn(['sliEntity', 'endpointId'], f => f.setValue(null).setTouched(true));
  }

  return updatedForm;
}
