/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { RRule } from 'rrule';
import React from 'react';

import { Stack } from '@instana/components';

import { addOrDeleteRRuleByWeekDay } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Label from 'in-components/form/Label';

interface WeeklyFrequencyProps {
  form: MapForm<any>;
  setFormRRule: Function;
  rrule: RRule;
}

export default function WeeklyFrequency({ form, setFormRRule, rrule }: WeeklyFrequencyProps) {
  const weeklyValues = rrule.options.byweekday || [];
  const onChangeWeekDay = (weekday: number) => {
    setFormRRule(form, addOrDeleteRRuleByWeekDay(rrule, weekday));
  };

  return (
    <div>
      <Label htmlFor="weekday-selection">{'On'}</Label>
      <Stack direction="horizontal" gap="small">
        <CheckboxFancy
          label="Mon"
          checked={weeklyValues.includes(RRule.MO.weekday)}
          onChange={() => onChangeWeekDay(RRule.MO.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Tues"
          checked={weeklyValues.includes(RRule.TU.weekday)}
          onChange={() => onChangeWeekDay(RRule.TU.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Wed"
          checked={weeklyValues.includes(RRule.WE.weekday)}
          onChange={() => onChangeWeekDay(RRule.WE.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Thurs"
          checked={weeklyValues.includes(RRule.TH.weekday)}
          onChange={() => onChangeWeekDay(RRule.TH.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Fri"
          checked={weeklyValues.includes(RRule.FR.weekday)}
          onChange={() => onChangeWeekDay(RRule.FR.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Sat"
          checked={weeklyValues.includes(RRule.SA.weekday)}
          onChange={() => onChangeWeekDay(RRule.SA.weekday)}
          size="large"
        />
        <CheckboxFancy
          label="Sun"
          checked={weeklyValues.includes(RRule.SU.weekday)}
          onChange={() => onChangeWeekDay(RRule.SU.weekday)}
          size="large"
        />
      </Stack>
    </div>
  );
}
