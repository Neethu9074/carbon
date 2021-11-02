/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { applicationType, availabilityType, websiteTimeBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { createMetricsForm, addGoodBadEventsForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import useFormSideEffects, { CHANGE_TYPES } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { getMetricOptions } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';

const formSideEffects = [
  {
    path: ['sliEntity', 'sliType'],
    effects: [resetFormForSliType]
  }
];

const applicationFormSideEffects = [
  ...formSideEffects,
  {
    path: ['metricConfiguration', 'metricName'],
    effects: [resetMetricConfiguration('application', () => 'calls')]
  }
];

const websiteFormSideEffects = [
  ...formSideEffects,
  {
    path: ['metricConfiguration', 'metricName'],
    effects: [resetMetricConfiguration('website', f => f.get('sliEntity').get('beaconType').value)]
  }
];

export function useApplicationSliFormSideEffects(form, setForm) {
  return useFormSideEffects({
    form,
    setForm,
    effects: applicationFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

export function useWebsiteSliFormSideEffects(form, setForm) {
  return useFormSideEffects({
    form,
    setForm,
    effects: websiteFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

export default function useSliFormSideEffects(entityType, form, setForm) {
  return useFormSideEffects({
    form,
    setForm,
    effects: entityType === 'application' ? applicationFormSideEffects : websiteFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function resetFormForSliType(form) {
  let updatedForm = form;
  const sliType = form.get('sliEntity').get('sliType').value;
  if (sliType === applicationType || sliType === websiteTimeBased) {
    // Time Based SLIs
    updatedForm = updatedForm
      .put('metricConfiguration', createMetricsForm({}, sliType))
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

function resetMetricConfiguration(entityType, getMetricEntityType) {
  return form => {
    const metricName = form.get('metricConfiguration')?.get('metricName')?.value;
    const aggregationData = getMetricOptions(entityType, getMetricEntityType(form))[metricName];

    // reset threshold value when metric changed, because value for metric A does not have any meaning
    // for metric B, as well as the format of the threshold could have completely changed
    return form
      .updateIn(['metricConfiguration', 'threshold'], f => f.setValue('').setTouched(false))
      .updateIn(['metricConfiguration', 'metricAggregation'], f =>
        f.setValue(aggregationData.defaultValue).setTouched(true)
      );
  };
}
