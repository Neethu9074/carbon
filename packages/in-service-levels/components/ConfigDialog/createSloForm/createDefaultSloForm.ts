/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { SloEntityType } from '@instana/types';

import {
  SloEntityFields,
  SloForm,
  SloIndicatorFields,
  SloScopeFields,
  SloTimeWindowFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { thresholdFieldValidator } from 'in-service-levels/components/ConfigDialog/createSloForm/validationLogic';
import { createSloNameTagsFields } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';

export const getDefaultEntityFields = (entityType: SloEntityType): SloEntityFields => ({
  entityId: createField({ value: '' }),
  type: createField({ value: entityType })
});

export const getDefaultScopeFields = (): SloScopeFields => ({
  beaconType: createField({ value: 'httpRequest' }),
  boundaryScope: createField({ value: 'ALL' }),
  endpointId: createField({ value: '' }),
  includeInternal: createField({ value: false }),
  includeSynthetic: createField({ value: false }),
  serviceId: createField({ value: '' }),
  tagFilterExpression: createField({ value: [] })
});

export const getDefaultIndicatorFields = (): SloIndicatorFields => ({
  aggregation: createField({ value: 'SUM' }),
  badEventsFilter: createField({ value: fromBackendModel(undefined) }),
  blueprint: createField({ value: 'latency' }),
  goodEventsFilter: createField({ value: fromBackendModel(undefined) }),
  threshold: createField({ value: undefined, validator: thresholdFieldValidator }),
  type: createField({ value: 'timeBased' })
});

export const getDefaultTimeWindowFields = (): SloTimeWindowFields => ({
  duration: createField({ value: 1 }),
  durationUnit: createField({ value: 'week' }),
  startTimestamp: createField({ value: Date.now() }),
  type: createField({ value: 'fixed' })
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
        items: getDefaultIndicatorFields()
      }),
      timeWindow: createMapForm({
        items: getDefaultTimeWindowFields()
      }),
      nameTags: createMapForm({
        items: createSloNameTagsFields({ name: '', tags: [] })
      })
    }
  });
};
