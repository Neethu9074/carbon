/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, MapPath } from 'formalistic';

import {
  AggregationType,
  ApplicationBoundaryScope,
  BlueprintType,
  DateAsNumber,
  DurationUnitType,
  ServiceLevelIndicatorType,
  SloEntityType,
  TimeWindowType
} from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SloBeaconTypes } from 'in-service-levels/types';

type SloFormFields = {
  entity: SloEntityForm;
  indicator: SloIndicatorForm;
  scope: SloScopeForm;
  timeWindow: SloTimeWindowForm;
};

export type SloForm = MapForm<SloFormFields>;
export type SloFormPath = MapPath<SloFormFields>;
export type SloFormOnChange = (path: SloFormPath, updater: (i: Item) => Item) => void;

export type SloEntityForm = MapForm<SloEntityFields>;
export type SloScopeForm = MapForm<SloScopeFields>;
export type SloIndicatorForm = MapForm<SloIndicatorFields>;
export type SloTimeWindowForm = MapForm<SloTimeWindowFields>;

export type SloEntityFields = {
  entityId: Field<string>;
  type: Field<SloEntityType>;
};

export type SloScopeFields = {
  beaconType: Field<SloBeaconTypes>;
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
  endpointId: Field<string>;
  serviceId: Field<string>;
  tagFilterExpression: Field<FormModelElement[]>;
};

export type SloIndicatorFields = {
  aggregation: Field<AggregationType>;
  badEventsFilter: Field<FormModelElement[]>;
  blueprint: Field<BlueprintType>;
  goodEventsFilter: Field<FormModelElement[]>;
  threshold: Field<number>;
  type: Field<ServiceLevelIndicatorType>;
};

export type SloTimeWindowFields = {
  duration: Field<number>;
  durationUnit: Field<DurationUnitType>;
  startTimestamp: Field<DateAsNumber>;
  type: Field<TimeWindowType>;
};
