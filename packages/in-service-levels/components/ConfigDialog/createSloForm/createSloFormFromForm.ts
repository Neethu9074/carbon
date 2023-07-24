/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import {
  AggregationType,
  ApplicationBoundaryScope,
  BlueprintType,
  DateAsNumber,
  DurationUnitType
} from '@instana/types';

import {
  SloEntityFields,
  SloForm,
  SloNameTagsFields,
  SloIndicatorFields,
  SloScopeFields,
  SloTimeWindowFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { createSloNameTagsFields } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

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
    boundaryScope: createField<ApplicationBoundaryScope>({ value: boundaryScopeValue }),
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
  const thresholdFieldValue = form.getIn(['indicator', 'threshold']).value;
  const indicatorTypeValue = form.getIn(['indicator', 'type']).value;

  return {
    aggregation: createField<AggregationType>({ value: aggregationFieldValue }),
    badEventsFilter: createField<FormModelElement[]>({
      value: badEventsFilterFieldValue
    }),
    blueprint: createField<BlueprintType>({ value: blueprintFieldValue }),
    goodEventsFilter: createField<FormModelElement[]>({
      value: goodEventsFilterFieldValue
    }),
    threshold: createField<number>({ value: thresholdFieldValue }),
    type: createField({ value: indicatorTypeValue })
  };
};

export const getTimeWindowFormFieldFromForm = (form: SloForm): SloTimeWindowFields => {
  const durationFieldValue = form.getIn(['timeWindow', 'duration']).value;
  const durationUnitFieldValue = form.getIn(['timeWindow', 'durationUnit']).value;
  const startTimestampFieldValue = form.getIn(['timeWindow', 'startTimestamp']).value;
  const timeWindowType = form.getIn(['timeWindow', 'type']).value;

  return {
    duration: createField<number>({ value: durationFieldValue }),
    durationUnit: createField<DurationUnitType>({ value: durationUnitFieldValue }),
    startTimestamp: createField<DateAsNumber>({ value: startTimestampFieldValue }),
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
      timeWindow: createMapForm({
        items: getTimeWindowFormFieldFromForm(form)
      }),
      nameTags: createMapForm({
        items: getNameTagFieldsFromForm(form)
      })
    }
  });
};
