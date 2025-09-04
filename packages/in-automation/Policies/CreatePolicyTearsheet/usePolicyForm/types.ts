/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item, MapForm, MapPath } from 'formalistic';

import { ConditionWhen, ParameterValue, TriggerType } from '@instana/types';

import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { Frequency } from 'rrule';
import { ONE_TIME } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';

export type ApplyOn = (typeof SCOPE)[keyof typeof SCOPE];

export type RepeatUntil = 'date' | 'occurrences' | 'forever';

export type ScopeFormItems = {
  applyOn: Field<ApplyOn>;
  query: Field<string>;
};

export type PolicyTypeFormItems = {
  manual: Field<boolean>;
  automatic: Field<boolean>;
};

export type ActionConfigurationFormItems = {
  actionId: Field<string>;
  agentId: Field<string>;
  parameters: Field<ParameterValue[]>;
  type: MapForm<PolicyTypeFormItems>;
  isActionPreSelected: Field<boolean>;
  isSchedulePolicy: Field<boolean>;
};

export type StartFields = {
  date: Field<string>;
  time: Field<string>;
};
type StartForm = MapForm<StartFields>;

export type RecurrenceFields = {
  occurrences: Field<number>;
  repeatUntil: Field<RepeatUntil | undefined>;
  interval: Field<number | undefined>;
  daysOfTheWeek: Field<number[]>;
  dayInterval: Field<DayInterval | undefined>;
  date: Field<number | undefined>;
  month: Field<Month | undefined>;
  repeatType: Field<RepeatType | undefined>;
  endDate: Field<string>;
};

type RecurrenceForm = MapForm<RecurrenceFields>;

type ScheduleFormFields = {
  start: StartForm;
  recurrence: RecurrenceForm;
  frequency: Field<typeof ONE_TIME | Frequency>;
};

type ScheduleForm = MapForm<ScheduleFormFields>;

export type PolicyFormItems = {
  name: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
  triggerType: Field<TriggerType>;
  triggerId: Field<string>;
  scope: MapForm<ScopeFormItems>;
  action: MapForm<ActionConfigurationFormItems>;
  schedule: ScheduleForm;
  condition: Field<PolicyCondition>;
  conditionWhen: Field<ConditionWhen>;
};

export type PolicyForm = MapForm<PolicyFormItems>;

export type RepeatType = 'date' | 'day';

export type DayInterval = -1 | 1 | 2 | 3 | 4;

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type PolicyCondition = 'event' | 'schedule';

type PolicyFormPath = MapPath<PolicyFormItems>;
export type PolicyFormOnChange = (path: PolicyFormPath, updater: (i: Item) => Item) => void;
