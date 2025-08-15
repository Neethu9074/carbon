/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Column, Dropdown } from '@instana/carbon';

import { t } from 'in-i18n';

import DateSection from 'in-automation/Policies/CreatePolicyTearsheet/components/DateSection';
import MonthSection from 'in-automation/Policies/CreatePolicyTearsheet/components/MonthSection';
import RepeatTypeSection from 'in-automation/Policies/CreatePolicyTearsheet/components/RepeatTypeSection';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import {
  dayIntervalOptions,
  daysOfTheWeekOptions
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';

import local from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet.mless';

export default function YearlySection() {
  const { form, onChange } = usePolicyFormContext();

  const scheduleField = form.get('schedule');
  const daysOfTheWeekField = scheduleField.getIn(['recurrence', 'daysOfTheWeek']);
  const dayIntervalField = scheduleField.getIn(['recurrence', 'dayInterval']);
  const repeatTypeField = scheduleField.getIn(['recurrence', 'repeatType']);

  const isDaysOfTheWeekFieldValid = isFieldValid(daysOfTheWeekField);
  const isDayIntervalFieldValid = isFieldValid(dayIntervalField);

  const [dayOfTheWeek] = daysOfTheWeekField.value;
  return (
    <>
      <RepeatTypeSection />
      {repeatTypeField.value === 'day' && (
        <>
          <Column lg={4} md={4}>
            <Dropdown
              onChange={({ selectedItem }) =>
                onChange(['schedule', 'recurrence', 'dayInterval'], () =>
                  dayIntervalField.setValue(selectedItem?.value).setTouched(true)
                )
              }
              label={t('in-automation:policyCreateTearsheet.select')}
              invalid={!isDayIntervalFieldValid}
              invalidText={getValidationMessage(dayIntervalField)}
              titleText={t(
                'in-automation:policyCreateTearsheet.repeatOnEvery'
              )}
              id="policy-schedule-yearly-interval"
              items={dayIntervalOptions}
              selectedItem={dayIntervalOptions.find(({ value }) => value === dayIntervalField.value)}
            />
          </Column>
          <Column lg={4} md={4}>
            <Dropdown
              onChange={({ selectedItem }) => {
                onChange(['schedule', 'recurrence', 'daysOfTheWeek'], () =>
                  daysOfTheWeekField.setValue(selectedItem ? [selectedItem.value] : []).setTouched(true)
                );
              }}
              label={t('in-automation:policyCreateTearsheet.select')}
              titleText={t('in-automation:policyCreateTearsheet.day')}
              id="policy-schedule-days-of-the-week"
              invalid={!isDaysOfTheWeekFieldValid}
              invalidText={getValidationMessage(daysOfTheWeekField)}
              items={daysOfTheWeekOptions}
              selectedItem={daysOfTheWeekOptions.find(({ value }) => value === dayOfTheWeek)}
            />
          </Column>
          <Column className={local['margin-top']} lg={1}>
            <span>of</span>
          </Column>
          <MonthSection />
        </>
      )}
      {repeatTypeField.value === 'date' && (
        <>
          <MonthSection />
          <DateSection />
        </>
      )}
    </>
  );
}
