/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getTimezoneOffset } from 'date-fns-tz';
import { RRule } from 'rrule';
import React from 'react';

import { Link, Message, Spacer } from '@instana/components';
import { Column, Dropdown } from '@instana/carbon';

import { ONE_TIME, recurrenceOptions } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import RecurrenceSection from 'in-automation/Policies/CreatePolicyTearsheet/components/RecurrenceSection';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import MonthlySection from 'in-automation/Policies/CreatePolicyTearsheet/components/MonthlySection';
import WeeklySection from 'in-automation/Policies/CreatePolicyTearsheet/components/WeeklySection';
import YearlySection from 'in-automation/Policies/CreatePolicyTearsheet/components/YearlySection';
import HourlySection from 'in-automation/Policies/CreatePolicyTearsheet/components/HourlySection';
import DailySection from 'in-automation/Policies/CreatePolicyTearsheet/components/DailySection';
import { getEntityIdView, userSettingsGeneral } from 'in-settings/navigation/paths';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import DateInput from 'in-components/form/DateInput/DateInput';
import { getSingle } from 'in-services/settings/settings';
import { t } from 'in-i18n';

export default function TriggerScheduleTab() {
  const { form } = usePolicyFormContext();
  const frequencyField = form.getIn(['schedule', 'frequency']);

  return (
    <>
      <Column lg={6} md={8}>
        <StartDateSection />
      </Column>
      <Column lg={8} md={8}>
        <FrequencySection />
      </Column>
      <Column lg={3} md={3}>
        <StartTimeSection />
      </Column>
      {frequencyField.value === RRule.HOURLY && <HourlySection />}
      {frequencyField.value === RRule.DAILY && <DailySection />}
      {frequencyField.value === RRule.WEEKLY && <WeeklySection />}
      {frequencyField.value === RRule.MONTHLY && <MonthlySection />}
      {frequencyField.value === RRule.YEARLY && <YearlySection />}
      {frequencyField.value !== ONE_TIME && (
        <>
          <Spacer vertical="small" />
          <Column lg={16} md={8}>
            <RecurrenceSection />
          </Column>
        </>
      )}
    </>
  );
}

function StartDateSection() {
  const { form, onChange } = usePolicyFormContext();
  const startDateField = form.getIn(['schedule', 'start', 'date']);
  const isStartDateValid = isFieldValid(startDateField);

  return (
    <>
      <DateInput
        id="policy-schedule-start-date"
        placeholder="YYYY-MM-DD"
        labelText={t('in-automation:policyCreateTearsheet.startDate')}
        hasError={!isStartDateValid}
        value={startDateField.value}
        size="md"
        onChange={e => {
          if (e) onChange(['schedule', 'start', 'date'], () => startDateField.setValue(e as string).setTouched(true));
        }}
      />
      <TouchedMessages field={startDateField} />
    </>
  );
}

function FrequencySection() {
  const { form, onChange } = usePolicyFormContext();
  const frequencyField = form.getIn(['schedule', 'frequency']);
  return (
    <Dropdown
      id="policy-schedule-frequency"
      label=""
      titleText={t('in-automation:policyCreateTearsheet.repeat')}
      onChange={({ selectedItem }) =>
        onChange(['schedule', 'frequency'], () => frequencyField.setValue(selectedItem!.value).setTouched(true))
      }
      selectedItem={recurrenceOptions.find(({ value }) => value === frequencyField.value)}
      items={recurrenceOptions}
    />
  );
}

function StartTimeSection() {
  const { form, setForm } = usePolicyFormContext();
  const scheduleField = form.get('schedule');
  const startTimeField = scheduleField.getIn(['start', 'time']);
  const isStartTimeValid = isFieldValid(startTimeField);

  return (
    <>
      <TimePicker
        id="policy-trigger-start-time"
        labelText={t('in-automation:policyCreateTearsheet.startTime')}
        value={startTimeField.value}
        invalid={!isStartTimeValid}
        invalidText={getValidationMessage(startTimeField)}
        onChange={value =>
          setForm(form =>
            form.updateIn(['schedule', 'start', 'time'], () => startTimeField.setValue(value).setTouched(true))
          )
        }
      />
      {startTimeField.value && <TimezoneMessage />}
    </>
  );
}

function TimezoneMessage() {
  const { createHrefToPath } = useNavigation();

  const currentTimezoneId = getSingle('formatTimestampsAsUtc')
    ? 'UTC'
    : new Intl.DateTimeFormat().resolvedOptions().timeZone;

  const settingsHref = getEntityIdView(userSettingsGeneral, '', createHrefToPath);

  const utcOffset = (timezoneID: string) => {
    if (timezoneID === 'UTC') return '+00:00';
    const pad = (val: number) => (val < 10 ? '0' + val : val);
    const offsetInMinutes = getTimezoneOffset(timezoneID) / 60000;
    const sign = offsetInMinutes >= 0 ? '+' : '-';
    const offset = Math.abs(offsetInMinutes);
    const hours = pad(Math.floor(offset / 60));
    const minutes = pad(offset % 60);

    return sign + hours + ':' + minutes;
  };

  const message =
    currentTimezoneId !== 'UTC'
      ? t('in-settings:maintenanceWindow.timezone.currentTimezoneMessage', {
          utc_offset: utcOffset(currentTimezoneId)
        }) + ' '
      : null;

  return (
    <div style={{ marginTop: '1rem' }}>
      {message && (
        <Message withIcon small>
          <div>
            {message}
            <Link href={settingsHref || ''}>{t('in-settings:tabs.userSettings')}</Link>
          </div>
        </Message>
      )}
    </div>
  );
}
