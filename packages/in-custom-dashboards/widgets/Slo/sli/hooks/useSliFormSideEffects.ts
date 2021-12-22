/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  applicationType,
  availabilityType,
  SliEntityType,
  websiteTimeBased
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { createMetricsForm, addGoodBadEventsForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { getMetricOptions, MetricEntityType, MetricType } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { Field, Item, MapForm } from 'formalistic';
import { AggregationType } from 'in-types';

const formSideEffects = [
  {
    path: ['sliEntity', 'sliType'],
    effects: [resetFormForSliType as EffectFunction]
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
    effects: [
      resetMetricConfiguration(
        'website',
        f => ((f.get('sliEntity') as MapForm).get('beaconType') as Field<MetricEntityType<'website'>>).value
      )
    ]
  }
];

export function useApplicationSliFormSideEffects(form: MapForm, setForm: (f: Item) => void) {
  return useFormSideEffects({
    form,
    setForm,
    effects: applicationFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

export function useWebsiteSliFormSideEffects(form: MapForm, setForm: (f: Item) => void) {
  return useFormSideEffects({
    form,
    setForm,
    effects: websiteFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function resetFormForSliType(form: MapForm): MapForm {
  let updatedForm = form;
  const sliType = ((form.get('sliEntity') as MapForm).get('sliType') as Field<SliEntityType>).value;
  if (sliType === applicationType || sliType === websiteTimeBased) {
    // Time Based SLIs
    updatedForm = updatedForm
      .put('metricConfiguration', createMetricsForm({}, sliType))
      .updateIn(['sliEntity'], f =>
        (f as MapForm).remove('goodEventFilterExpression').remove('badEventFilterExpression')
      );
  } else {
    // Event Based SLIs
    updatedForm = updatedForm
      .remove('metricConfiguration')
      .updateIn(['sliEntity'], sliEntitySubForm => addGoodBadEventsForm(sliEntitySubForm as MapForm));
  }

  if (sliType === availabilityType) {
    updatedForm = updatedForm
      .updateIn(['sliEntity', 'serviceId'], f => (f as Field<string | null>).setValue(null).setTouched(true))
      .updateIn(['sliEntity', 'endpointId'], f => (f as Field<string | null>).setValue(null).setTouched(true));
  }

  return updatedForm;
}

function resetMetricConfiguration<S extends MonitoringSource>(
  entityType: S,
  getMetricEntityType: (f: MapForm) => MetricEntityType<S>
): EffectFunction {
  return f => {
    const form = f as MapForm;
    const metricName = ((form.get('metricConfiguration') as MapForm).get('metricName') as Field<
      MetricType<S, MetricEntityType<S>>
    >).value;
    const aggregationData = getMetricOptions(entityType, getMetricEntityType(form))[metricName];

    // reset threshold value when metric changed, because value for metric A does not have any meaning
    // for metric B, as well as the format of the threshold could have completely changed
    return form
      .updateIn(['metricConfiguration', 'threshold'], field => (field as Field<string>).setValue('').setTouched(false))
      .updateIn(['metricConfiguration', 'metricAggregation'], field =>
        (field as Field<AggregationType>).setValue(aggregationData.defaultValue).setTouched(true)
      );
  };
}
