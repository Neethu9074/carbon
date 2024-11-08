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
  DurationUnitType,
  ServiceLevelIndicatorType,
  SloEntityType,
  TimeWindowType
} from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SloBeaconTypes } from 'in-service-levels/types';

export type CreateSloDialogMode = 'NEW' | 'CLONE' | 'EDIT';

export type SloFormFields = {
  entity: SloEntityForm;
  indicator: SloIndicatorForm;
  scope: SloScopeForm;
  objective: SloObjectiveForm;
  nameTags: SloNameTagsForm;
};

export type SloFormTarget = MapForm<SloTargetFields>;
export type CustomBlueprintType = BlueprintType | 'custom' | undefined;

export type SloForm = MapForm<SloFormFields>;
export type SloFormPath = MapPath<SloFormFields>;
export type SloFormOnChange = (path: SloFormPath, updater: (i: Item) => Item) => void;

export type SloEntityForm = MapForm<SloEntityFields>;
export type SloScopeForm = MapForm<SloScopeFields>;
export type SloIndicatorForm = MapForm<SloIndicatorFields>;
export type SloObjectiveForm = MapForm<SloObjectiveFields>;
export type SloTimeWindowForm = MapForm<SloTimeWindowFields>;
export type SloNameTagsForm = MapForm<SloNameTagsFields>;

export type SloTargetFields = {
  target: Field<number | undefined>;
};

export type SloEntityFields = {
  entityIds: Field<string[]>;
  type: Field<SloEntityType>;
};

export type SloScopeFields = {
  beaconType: Field<SloBeaconTypes | undefined>;
  boundaryScope: Field<ApplicationBoundaryScope | undefined>;
  includeInternal: Field<boolean | undefined>;
  includeSynthetic: Field<boolean | undefined>;
  endpointId: Field<string | undefined>;
  serviceId: Field<string | undefined>;
  tagFilterExpression: Field<FormModelElement[] | undefined>;
};

export type SloIndicatorFields = {
  aggregation: Field<AggregationType>;
  badEventsFilter: Field<FormModelElement[]>;
  blueprint: Field<BlueprintType>;
  goodEventsFilter: Field<FormModelElement[]>;
  threshold: Field<number | undefined>;
  type: Field<ServiceLevelIndicatorType | undefined>;
};

export type SloObjectiveFields = {
  target: Field<number | undefined>;
  duration: Field<number>;
  durationUnit: Field<DurationUnitType>;
  startTimestamp: MapForm<TimeStampFields>;
  type: Field<TimeWindowType>;
};

export type SloTimeWindowFields = {
  duration: Field<number>;
  durationUnit: Field<DurationUnitType>;
  startTimestamp: MapForm<TimeStampFields>;
  type: Field<TimeWindowType>;
};

export type SloNameTagsFields = {
  name: Field<string>;
  tags: Field<string[]>;
};

export type TimeStampFields = {
  date: Field<string>;
  time: Field<string>;
};
