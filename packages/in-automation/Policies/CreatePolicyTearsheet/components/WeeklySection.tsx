/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Column, Dropdown, MultiSelect, NumberInput } from '@instana/carbon';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { daysOfTheWeekOptions, ONE_TIME } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';
import { t } from 'in-i18n';

const weeklyIntervalOption = {
  value: 'weeks',
  label: t('in-automation:policyCreateTearsheet.intervalDropdown.weeks')
};

export default function WeeklySection() {
  const { form, onChange } = usePolicyFormContext();
  const scheduleField = form.get('schedule');
  const frequencyField = scheduleField.get('frequency');
  const intervalField = scheduleField.getIn(['recurrence', 'interval']);
  const daysOfTheWeekField = scheduleField.getIn(['recurrence', 'daysOfTheWeek']);

  const isIntervalFieldValid = isFieldValid(intervalField);
  const isDaysOfTheWeekFieldValid = isFieldValid(daysOfTheWeekField);

  if (frequencyField.value === ONE_TIME) return null;

  return (
    <>
      <Column lg={5} md={5}>
        <NumberInput
          label={t('in-automation:policyCreateTearsheet.repeatEvery')}
          id="policy-schedule-interval"
          min={0}
          invalid={!isIntervalFieldValid}
          invalidText={getValidationMessage(intervalField)}
          max={52}
          value={intervalField.value}
          onChange={(_, { value }) =>
            onChange(['schedule', 'recurrence', 'interval'], () =>
              intervalField.setValue(Number(value)).setTouched(true)
            )
          }
        />
      </Column>
      <Column lg={4} md={4}>
        <Dropdown
          label=""
          titleText={<wbr />}
          id="policy-schedule-interval-unit"
          items={[weeklyIntervalOption]}
          readOnly
          disabled
          selectedItem={weeklyIntervalOption}
        />
      </Column>
      <Column lg={7} md={7}>
        <MultiSelect
          label={t('in-automation:policyCreateTearsheet.select')}
          onChange={({ selectedItems }) => {
            onChange(['schedule', 'recurrence', 'daysOfTheWeek'], () =>
              daysOfTheWeekField.setValue(selectedItems?.map(({ value }) => value) ?? []).setTouched(true)
            );
          }}
          invalid={!isDaysOfTheWeekFieldValid}
          invalidText={getValidationMessage(daysOfTheWeekField)}
          sortItems={items => [...items].sort((a, b) => a.value - b.value)}
          titleText={t('in-automation:policyCreateTearsheet.daysOfTheWeek')}
          id="correction-window-days-of-the-week"
          items={daysOfTheWeekOptions}
          selectedItems={daysOfTheWeekOptions.filter(({ value }) => daysOfTheWeekField.value.includes(value))}
        />
      </Column>
    </>
  );
}
