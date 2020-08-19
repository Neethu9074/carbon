import { createMapForm, createField } from 'formalistic';

export const ApplicationType = 'application';
export const AvailabilityType = 'availability';

export function createForm(sliConfig, applicationId) {
  const sliEntityWithApplicationId = {
    ...sliConfig,
    sliEntity: {
      ...sliConfig?.sliEntity,
      applicationId
    }
  };
  const { id, sliName, sliEntity, metricConfiguration } = sliEntityWithApplicationId;
  let form = createMapForm();
  if (id) {
    form = form.put('id', createField({ value: id }));
  }
  form = form.put('sliName', createField({ value: sliName ?? '' }));
  form = form.put('sliEntity', createSliEntityForm(sliEntity));
  if (sliEntity.sliType === ApplicationType) {
    form = form.put('metricConfiguration', createMetricsForm(metricConfiguration ?? {}));
  }
  return form;
}

function createSliEntityForm(sliEntity) {
  const form = createMapForm()
    .put(
      'sliType',
      createField({
        value: sliEntity.sliType ?? null
      })
    )
    .put(
      'applicationId',
      createField({
        value: sliEntity.applicationId
      })
    )
    .put(
      'serviceId',
      createField({
        value: sliEntity.serviceId ?? null
      })
    )
    .put(
      'endpointId',
      createField({
        value: sliEntity.endpointId ?? null
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: sliEntity.boundaryScope ?? null
      })
    );

  if (sliEntity.sliType === AvailabilityType) {
    return addGoodBadEventsForm(form, sliEntity);
  }
  return form;
}

function addGoodBadEventsForm(form, sliEntity) {
  return form
    .put(
      'goodEventFilters',
      createField({
        value: sliEntity?.goodEventFilters ?? null
      })
    )
    .put(
      'badEventFilters',
      createField({
        value: sliEntity?.badEventFilters ?? null
      })
    );
}

export function resetFormForSliType(sliType, setForm, form) {
  let newForm = form.updateIn(['sliEntity', 'sliType'], f => f.setValue(sliType).setTouched(true));
  if (sliType === ApplicationType) {
    setForm(
      newForm
        .put('metricConfiguration', createMetricsForm({}))
        .updateIn(['sliEntity'], f => f.remove('goodEventFilters'))
        .updateIn(['sliEntity'], f => f.remove('badEventFilters'))
    );
  } else {
    newForm = newForm.remove('metricConfiguration');
    setForm(addGoodBadEventsForm(newForm));
  }
}

function createMetricsForm(metricConfiguration) {
  return createMapForm()
    .put(
      'metricName',
      createField({
        value: metricConfiguration.metricName ?? 'latency'
      })
    )
    .put(
      'metricAggregation',
      createField({
        value: metricConfiguration.metricAggregation ?? 'P75'
      })
    )
    .put(
      'threshold',
      createField({
        value: metricConfiguration.threshold ?? 99
      })
    );
}
