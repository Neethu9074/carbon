/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import {
  ServiceLevelIndicatorType,
  SloEntityType,
  TimeWindowType,
  DurationUnitType,
  AggregationType,
  ServiceLevelObjectiveConfiguration,
  BlueprintType,
  SLIThresholdOperator,
  TrafficIndicatorType
} from '@instana/types';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { SloForm, SloScopeFields } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { defaultSliThresholdOperator } from 'in-service-levels/constants';

export const testDate = new Date('2020-01-01');

export const testWebsiteForm: SloForm = createMapForm({
  items: {
    entity: createMapForm({
      items: {
        entityIds: createField<string[]>({ value: ['22222'] }),
        type: createField<SloEntityType>({ value: 'website' })
      }
    }),
    indicator: createMapForm({
      items: {
        aggregation: createField<AggregationType>({ value: 'P90' }),
        badEventsFilter: createField<FormModelElement[]>({ value: fromBackendModel(undefined) }),
        blueprint: createField<BlueprintType>({ value: 'latency' }),
        operator: createField<SLIThresholdOperator>({ value: defaultSliThresholdOperator }),
        trafficType: createField<TrafficIndicatorType | undefined>({ value: undefined }),
        goodEventsFilter: createField<FormModelElement[]>({ value: fromBackendModel(undefined) }),
        threshold: createField<number | undefined>({ value: 55 }),
        type: createField<ServiceLevelIndicatorType | undefined>({ value: 'eventBased' })
      }
    }),
    scope: createMapForm<SloScopeFields>({
      items: {
        beaconType: createField({ value: 'pageLoad' }),
        boundaryScope: createField({ value: 'INBOUND' }),
        endpointId: createField({ value: '' }),
        includeInternal: createField({ value: false }),
        includeSynthetic: createField({ value: false }),
        serviceId: createField({ value: '' }),
        tagFilterExpression: createField({ value: fromBackendModel(undefined) })
      }
    }),
    objective: createMapForm({
      items: {
        target: createField<number | undefined>({ value: 1 }),
        startTimestamp: createMapForm({
          items: {
            date: createField<string>({ value: '2020-01-01' }),
            time: createField<string>({ value: '' })
          }
        }),
        duration: createField<number>({ value: 100 }),
        durationUnit: createField<DurationUnitType>({ value: 'day' }),
        type: createField<TimeWindowType>({ value: 'rolling' })
      }
    }),
    nameTags: createMapForm({
      items: {
        name: createField<string>({ value: 'Candy Store' }),
        tags: createField<string[]>({ value: ['sweets', 'soda'] })
      }
    })
  }
});

export const testApplicationForm: SloForm = createMapForm({
  items: {
    entity: createMapForm({
      items: {
        entityIds: createField<string[]>({ value: ['11111'] }),
        type: createField<SloEntityType>({ value: 'application' })
      }
    }),
    indicator: createMapForm({
      items: {
        aggregation: createField<AggregationType>({ value: 'MAX' }),
        badEventsFilter: createField<FormModelElement[]>({ value: fromBackendModel(undefined) }),
        blueprint: createField<BlueprintType>({ value: 'availability' }),
        operator: createField<SLIThresholdOperator>({ value: defaultSliThresholdOperator }),
        trafficType: createField<TrafficIndicatorType | undefined>({ value: undefined }),
        goodEventsFilter: createField<FormModelElement[]>({ value: fromBackendModel(undefined) }),
        threshold: createField<number | undefined>({ value: 66 }),
        type: createField<ServiceLevelIndicatorType | undefined>({ value: 'timeBased' })
      }
    }),
    scope: createMapForm<SloScopeFields>({
      items: {
        beaconType: createField({ value: 'pageLoad' }),
        boundaryScope: createField({ value: 'ALL' }),
        endpointId: createField({ value: 'endpoindNotEmpty' }),
        includeInternal: createField({ value: true }),
        includeSynthetic: createField({ value: false }),
        serviceId: createField({ value: '12345' }),
        tagFilterExpression: createField({ value: fromBackendModel(undefined) })
      }
    }),
    objective: createMapForm({
      items: {
        target: createField<number | undefined>({ value: 1 }),
        startTimestamp: createMapForm({
          items: {
            date: createField<string>({ value: '2020-01-01' }),
            time: createField<string>({ value: '' })
          }
        }),
        duration: createField<number>({ value: 100 }),
        durationUnit: createField<DurationUnitType>({ value: 'day' }),
        type: createField<TimeWindowType>({ value: 'fixed' })
      }
    }),
    nameTags: createMapForm({
      items: {
        name: createField<string>({ value: 'Vending Machine' }),
        tags: createField<string[]>({ value: ['candies', 'drinks', 'toilet paper'] })
      }
    })
  }
});

const sharedSloConfigFields = {
  id: '123456789',
  indicator: {
    aggregation: 'P95',
    blueprint: 'latency',
    threshold: 50,
    type: 'timeBased'
  } as const,
  name: 'Random name',
  tags: ['tag1', 'tag2'],
  target: 50,
  timeWindow: {
    startTimestamp: testDate.getTime(),
    duration: 1,
    durationUnit: 'week',
    type: 'fixed'
  } as const
};

export const testApplicationSloConfig: ServiceLevelObjectiveConfiguration = {
  entity: {
    applicationId: 'applicationIdHere',
    boundaryScope: 'INBOUND',
    endpointId: 'endpointIdHere',
    includeInternal: true,
    includeSynthetic: true,
    serviceId: 'serviceIdHere',
    type: 'application'
  },
  ...sharedSloConfigFields
};

export const testWebsiteSloConfig: ServiceLevelObjectiveConfiguration = {
  entity: {
    beaconType: 'httpRequest',
    type: 'website',
    websiteId: 'websiteIdHere'
  },
  ...sharedSloConfigFields
};
