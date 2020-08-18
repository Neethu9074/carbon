import { createMapForm, createField } from 'formalistic';

export function createForm(sliConfig, applicationId) {
  const sliEntityWithApplicationId = {
    ...sliConfig,
    sliEntity: {
      ...sliConfig?.sliEntity,
      applicationId
    }
  };
  const { sliType, sliEntity, metricConfiguration, sliName } = sliEntityWithApplicationId;

  let form = createMapForm();
  form = form.put('sliName', createField({ value: sliName ?? '' }));
  form = form.put('sliEntity', createSliTypeForm(sliEntity));
  if (sliType === 'application') {
    form = form.put('metricConfiguration', createMetricsForm(metricConfiguration ?? {}));
  }
  return form;
}

function createSliTypeForm(sliEntity) {
  return createMapForm()
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
}

export function resetFormForSliType(sliType, setForm, form) {
  let newForm = form.updateIn(['sliEntity', 'sliType'], f => f.setValue(sliType).setTouched(true));
  if (sliType === 'application') {
    setForm(
      newForm
        .put('metricConfiguration', createMetricsForm({}))
        .updateIn(['sliEntity'], f => f.remove('goodEventFilters'))
        .updateIn(['sliEntity'], f => f.remove('badEventFilters'))
    );
  } else {
    setForm(newForm.remove('metricConfiguration'));
  }
}

function createMetricsForm(metricConfiguration) {
  return createMapForm()
    .put(
      'metricName',
      createField({
        value: metricConfiguration.metricName ?? 'unknoWNmatrix'
      })
    )
    .put(
      'metricAggregation',
      createField({
        value: metricConfiguration.metricAggregation ?? 'P97'
      })
    )
    .put(
      'threshold',
      createField({
        value: metricConfiguration.threshold ?? 111
      })
    );
}
