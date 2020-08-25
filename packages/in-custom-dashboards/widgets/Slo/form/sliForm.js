import { createMapForm, createField } from 'formalistic';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { numericValidator } from 'in-services/validators/number';
import { boundaryScopes } from 'in-applications/constants';

export const ApplicationType = 'application';
export const AvailabilityType = 'availability';

export const sliTypeOptions = Object.freeze([
  { value: ApplicationType, label: 'Time-based' },
  { value: AvailabilityType, label: 'Event-based' }
]);

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
  form = form.put(
    'sliName',
    createField({
      value: sliName ?? '',
      validator: composeAndShortCircuitOnError(notUndefinedValidator, notBlankValidator)
    })
  );
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
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          notNullValidator,
          buildEnumValidator([ApplicationType, AvailabilityType])
        ),
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
        value: sliEntity.boundaryScope ?? boundaryScopes.inbound
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
        value: sliEntity?.goodEventFilters ?? []
      })
    )
    .put(
      'badEventFilters',
      createField({
        value: sliEntity?.badEventFilters ?? []
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
    setForm(
      newForm
        .updateIn(['sliEntity', 'serviceId'], f => f.setValue(null).setTouched(true))
        .updateIn(['sliEntity', 'endpointId'], f => f.setValue(null).setTouched(true))
        .remove('metricConfiguration')
        .updateIn(['sliEntity'], f => addGoodBadEventsForm(f))
    );
  }
}

function createMetricsForm(metricConfiguration) {
  return createMapForm()
    .put(
      'metricName',
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricName ?? 'latency'
      })
    )
    .put(
      'metricAggregation',
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricAggregation ?? 'P90'
      })
    )
    .put(
      'threshold',
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numericValidator),
        value: metricConfiguration.threshold ?? 15
      })
    );
}

const notNullValidator = v => {
  if (v === null) {
    return [
      {
        severity: 'error',
        message: `A value must be selected.`
      }
    ];
  }
};
