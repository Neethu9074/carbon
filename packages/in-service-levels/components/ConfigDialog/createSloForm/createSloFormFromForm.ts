/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { DurationUnitType } from '@instana/types';

import {
  SloEntityFields,
  SloForm,
  SloIndicatorFields,
  SloNameTagsFields,
  SloScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import {
  createIndicatorThresholdField,
  createSloNameTagsFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import {
  dateFieldValidator,
  timeFieldValidator
} from 'in-service-levels/components/ConfigDialog/createSloForm/validator';

export const getNameTagFieldsFromForm = (form: SloForm): SloNameTagsFields => {
  const name = form.getIn(['nameTags', 'name']).value;
  const tags = form.getIn(['nameTags', 'tags']).value;

  return createSloNameTagsFields({ name, tags });
};

export const getEntityFieldsFromForm = (form: SloForm): SloEntityFields => {
  const entityIdValue = form.getIn(['entity', 'entityId']).value;
  const entityTypeValue = form.getIn(['entity', 'type']).value;

  return { entityId: createField({ value: entityIdValue }), type: createField({ value: entityTypeValue }) };
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
    tagFilterExpression: createField({ value: tagFilterExpressionValue })
  };
};

export const getIndicatorFieldsFromForm = (form: SloForm): SloIndicatorFields => {
  const aggregationFieldValue = form.getIn(['indicator', 'aggregation']).value;
  const badEventsFilterFieldValue = form.getIn(['indicator', 'badEventsFilter']).value;
  const blueprintFieldValue = form.getIn(['indicator', 'blueprint']).value;
  const goodEventsFilterFieldValue = form.getIn(['indicator', 'goodEventsFilter']).value;
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const indicatorTypeValue = form.getIn(['indicator', 'type']).value;

  return {
    aggregation: createField({ value: aggregationFieldValue }),
    badEventsFilter: createField({
      value: badEventsFilterFieldValue
    }),
    blueprint: createField({ value: blueprintFieldValue }),
    goodEventsFilter: createField({
      value: goodEventsFilterFieldValue
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
    target: createField<number | undefined>({ value: targetFieldValue }),
    duration: createField<number>({ value: durationFieldValue }),
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
        items: getIndicatorFieldsFromForm(form)
      }),
      scope: createMapForm({
        items: getScopeFieldsFromForm(form)
      }),
      objective: createMapForm({
        items: getObjectiveFieldsFromForm(form)
      }),
      nameTags: createMapForm({
        items: getNameTagFieldsFromForm(form)
      })
    }
  });
};
