import { createMapForm, createField } from 'formalistic';

import { availabilityType, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { numericValidator } from 'in-services/validators/number';
import { boundaryScopes } from 'in-applications/constants';

export const sliFieldNames = Object.freeze({
  goodEventFilterExpression: 'goodEventFilterExpression',
  badEventFilterExpression: 'badEventFilterExpression'
});

export function createForm(sliConfig, applicationId, apDefaultBoundaryScope) {
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
  form = form.put('sliEntity', createSliEntityForm(sliEntity, apDefaultBoundaryScope));
  if (sliEntity.sliType === applicationType) {
    form = form.put('metricConfiguration', createMetricsForm(metricConfiguration ?? {}));
  }
  return form;
}

function createSliEntityForm(sliEntity, apDefaultBoundaryScope) {
  const form = createMapForm()
    .put(
      'sliType',
      createField({
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          notNullValidator,
          buildEnumValidator([applicationType, availabilityType])
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
        value:
          sliEntity.boundaryScope ??
          (apDefaultBoundaryScope === 'DEFAULT' ? boundaryScopes.inbound : apDefaultBoundaryScope)
      })
    );

  if (sliEntity.sliType === availabilityType) {
    return addGoodBadEventsForm(form, sliEntity);
  }
  return form;
}

function addGoodBadEventsForm(form, sliEntity) {
  return form
    .put(
      'goodEventFilters',
      createField({
        validator: isQB2ModeEnabled ? undefined : noEmptyFilterListValidator,
        value: sliEntity?.goodEventFilters ?? []
      })
    )
    .put(
      sliFieldNames.goodEventFilterExpression,
      createField({
        value: fromBackendModel(sliEntity?.goodEventFilterExpression)
      })
    )
    .put(
      sliFieldNames.badEventFilterExpression,
      createField({
        value: fromBackendModel(sliEntity?.badEventFilterExpression)
      })
    )
    .put(
      'badEventFilters',
      createField({
        validator: isQB2ModeEnabled ? undefined : noEmptyFilterListValidator,
        value: sliEntity?.badEventFilters ?? []
      })
    );
}

export function resetFormForSliType(sliType, setForm, form) {
  let newForm = form.updateIn(['sliEntity', 'sliType'], f => f.setValue(sliType).setTouched(true));
  if (sliType === applicationType) {
    setForm(
      newForm
        .put('metricConfiguration', createMetricsForm({}))
        .updateIn(['sliEntity'], f => f.remove('goodEventFilters'))
        .updateIn(['sliEntity'], f => f.remove('badEventFilters'))
        .updateIn(['sliEntity'], f => f.remove('goodEventFilterExpression'))
        .updateIn(['sliEntity'], f => f.remove('badEventFilterExpression'))
    );
  } else {
    setForm(
      newForm
        .updateIn(['sliEntity', 'serviceId'], f => f.setValue(null).setTouched(true))
        .updateIn(['sliEntity', 'endpointId'], f => f.setValue(null).setTouched(true))
        .remove('metricConfiguration')
        .updateIn(['sliEntity'], sliEntitySubForm => addGoodBadEventsForm(sliEntitySubForm))
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
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator, numericValidator),
        value: metricConfiguration.threshold ?? ''
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
  return null;
};

const noEmptyFilterListValidator = filterArray => {
  if (filterArray?.length > 0) return null;
  return [
    {
      severity: 'error',
      message: 'At least one filter condition must be configured.'
    }
  ];
};
