/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { DurationUnitType } from '@instana/types';

import {
  dateFieldValidator,
  indicatorFormValidator,
  noBlankEntitySelection,
  noInvalidTagFilterExpression,
  targetFieldValidator,
  timeFieldValidator,
  timeWindowValidator
} from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import {
  createIndicatorOperatorField,
  createIndicatorThresholdField,
  createSloNameTagsFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import {
  SloEntityFields,
  SloForm,
  SloIndicatorFields,
  SloNameTagsFields,
  SloScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';

export const getNameTagFieldsFromForm = (form: SloForm): SloNameTagsFields => {
  const name = form.getIn(['nameTags', 'name']).value;
  const tags = form.getIn(['nameTags', 'tags']).value;

  return createSloNameTagsFields({ name, tags });
};

export const getEntityFieldsFromForm = (form: SloForm): SloEntityFields => {
  const entityIdsValue = form.getIn(['entity', 'entityIds']).value;
  const entityTypeValue = form.getIn(['entity', 'type']).value;

  return {
    entityIds: createField({ value: entityIdsValue, validator: noBlankEntitySelection }),
    type: createField({ value: entityTypeValue })
  };
};

export const getScopeFieldsFromForm = (form: SloForm): SloScopeFields => {
  const beaconTypeValue = form.getIn(['scope', 'beaconType']).value;
  const boundaryScopeValue = form.getIn(['scope', 'boundaryScope']).value;
  const endpointIdValue = form.getIn(['scope', 'endpointId']).value;
  const includeInternalValue = form.getIn(['scope', 'includeInternal']).value;
  const includeSyntheticValue = form.getIn(['scope', 'includeSynthetic']).value;
  const serviceIdValue = form.getIn(['scope', 'serviceId']).value;
  const tagFilterExpressionValue = form.getIn(['scope', 'tagFilterExpression']).value;

  return {
    beaconType: createField({ value: beaconTypeValue }),
    boundaryScope: createField({ value: boundaryScopeValue }),
    endpointId: createField({ value: endpointIdValue }),
    includeInternal: createField({ value: includeInternalValue }),
    includeSynthetic: createField({ value: includeSyntheticValue }),
    serviceId: createField({ value: serviceIdValue }),
    tagFilterExpression: createField({ value: tagFilterExpressionValue ?? [], validator: noInvalidTagFilterExpression })
  };
};

export const getIndicatorFieldsFromForm = (form: SloForm): SloIndicatorFields => {
  const aggregationFieldValue = form.getIn(['indicator', 'aggregation']).value;
  const badEventsFilterFieldValue = form.getIn(['indicator', 'badEventsFilter']).value;
  const blueprintFieldValue = form.getIn(['indicator', 'blueprint']).value;
  const operatorField = form.getIn(['indicator', 'operator']);
  const goodEventsFilterFieldValue = form.getIn(['indicator', 'goodEventsFilter']).value;
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const indicatorTypeValue = form.getIn(['indicator', 'type']).value;
  const indicatorTrafficTypeField = form.getIn(['indicator', 'trafficType']);

  return {
    aggregation: createField({ value: aggregationFieldValue }),
    badEventsFilter: createField({
      value: badEventsFilterFieldValue
    }),
    blueprint: createField({ value: blueprintFieldValue }),
    goodEventsFilter: createField({
      value: goodEventsFilterFieldValue
    }),
    trafficType: createField({ value: indicatorTrafficTypeField.value }),
    operator: createIndicatorOperatorField({
      value: operatorField.value,
      touched: operatorField.touched,
      blueprint: blueprintFieldValue
    }),
    threshold: createIndicatorThresholdField({
      value: thresholdField.value,
      touched: thresholdField.touched,
      blueprint: blueprintFieldValue,
      indicatorType: indicatorTypeValue
    }),
    type: createField({ value: indicatorTypeValue })
  };
};

export const getTimeFields = (form: SloForm) => {
  const dateFieldValue = form.getIn(['objective', 'startTimestamp', 'date']).value;
  const timeFieldValue = form.getIn(['objective', 'startTimestamp', 'time']).value;

  return {
    date: createField<string>({ value: dateFieldValue, validator: dateFieldValidator }),
    time: createField({
      value: timeFieldValue,
      validator: timeFieldValidator
    })
  };
};

export const getObjectiveFieldsFromForm = (form: SloForm) => {
  const targetFieldValue = form.getIn(['objective', 'target']).value;
  const durationFieldValue = form.getIn(['objective', 'duration']).value;
  const durationUnitFieldValue = form.getIn(['objective', 'durationUnit']).value;
  const timeWindowType = form.getIn(['objective', 'type']).value;

  return {
    target: createField<number | undefined>({ value: targetFieldValue, validator: targetFieldValidator }),
    duration: createField<number>({
      value: durationFieldValue,
      validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator)
    }),
    durationUnit: createField<DurationUnitType>({ value: durationUnitFieldValue }),
    startTimestamp: createMapForm({ items: getTimeFields(form) }),
    type: createField({ value: timeWindowType })
  };
};
export const createSloFormFromForm = (form: SloForm): SloForm => {
  return createMapForm({
    items: {
      entity: createMapForm({
        items: getEntityFieldsFromForm(form)
      }),
      indicator: createMapForm({
        items: getIndicatorFieldsFromForm(form),
        validator: indicatorFormValidator
      }),
      scope: createMapForm({
        items: getScopeFieldsFromForm(form)
      }),
      objective: createMapForm({
        items: getObjectiveFieldsFromForm(form),
        validator: timeWindowValidator
      }),
      nameTags: createMapForm({
        items: getNameTagFieldsFromForm(form)
      })
    }
  });
};
