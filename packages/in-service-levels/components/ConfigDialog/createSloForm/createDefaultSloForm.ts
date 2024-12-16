/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { DurationUnitType, SloEntityType, TimeWindowType } from '@instana/types';

import {
  targetFieldValidator,
  timeFieldValidator,
  dateFieldValidator,
  timeWindowValidator,
  noInvalidTagFilterExpression,
  noBlankEntitySelection,
  indicatorFormValidator
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
  SloObjectiveFields,
  SloScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { defaultBlueprint, defaultSliThresholdOperator, defaultTrafficType } from 'in-service-levels/constants';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { formatDate, formatTime } from 'in-services/formatters/date';

export const getDefaultEntityFields = (entityType: SloEntityType): SloEntityFields => ({
  entityIds: createField({ value: [], validator: noBlankEntitySelection }),
  type: createField({ value: entityType })
});

export const getDefaultScopeFields = (): SloScopeFields => ({
  beaconType: createField({ value: 'httpRequest' }),
  boundaryScope: createField({ value: 'ALL' }),
  endpointId: createField({ value: '' }),
  includeInternal: createField({ value: false }),
  includeSynthetic: createField({ value: false }),
  serviceId: createField({ value: '' }),
  tagFilterExpression: createField({ value: [], validator: noInvalidTagFilterExpression })
});

export const getDefaultIndicatorFields = (): SloIndicatorFields => ({
  aggregation: createField({ value: 'MEAN' }),
  badEventsFilter: createField({ value: [] }),
  blueprint: createField({ value: defaultBlueprint }),
  goodEventsFilter: createField({ value: [] }),
  trafficType: createField({ value: defaultTrafficType }),
  operator: createIndicatorOperatorField({ value: defaultSliThresholdOperator, blueprint: defaultBlueprint }),
  threshold: createIndicatorThresholdField({
    value: undefined,
    blueprint: defaultBlueprint,
    indicatorType: 'timeBased'
  }),
  type: createField({ value: 'timeBased' })
});

export const getDefaultTimeFields = () => {
  const timeStamp = new Date().setHours(0, 0, 0, 0);
  return {
    date: createField<string>({ value: formatDate(timeStamp)!, validator: dateFieldValidator }),
    time: createField<string>({
      value: formatTime(timeStamp)!,
      validator: timeFieldValidator
    })
  };
};

export const getDefaultObjectiveFields = (): SloObjectiveFields => ({
  target: createField<number | undefined>({
    value: undefined,
    validator: targetFieldValidator
  }),
  duration: createField<number>({
    value: 1,
    validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator)
  }),
  durationUnit: createField<DurationUnitType>({ value: 'week' }),
  startTimestamp: createMapForm({ items: getDefaultTimeFields() }),
  type: createField<TimeWindowType>({ value: 'fixed' })
});

export const createDefaultSloForm = (entityType: SloEntityType): SloForm => {
  return createMapForm({
    items: {
      entity: createMapForm({
        items: getDefaultEntityFields(entityType)
      }),
      scope: createMapForm({
        items: getDefaultScopeFields()
      }),
      indicator: createMapForm({
        items: getDefaultIndicatorFields(),
        validator: indicatorFormValidator
      }),
      objective: createMapForm({
        items: getDefaultObjectiveFields(),
        validator: timeWindowValidator
      }),
      nameTags: createMapForm({
        items: createSloNameTagsFields({ name: '', tags: [] })
      })
    }
  });
};
