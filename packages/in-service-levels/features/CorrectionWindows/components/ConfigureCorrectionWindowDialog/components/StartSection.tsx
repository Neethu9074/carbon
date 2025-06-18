/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import cx from 'classnames';

import { Column, Dropdown, NumberInput, Toggle } from '@instana/carbon';
import { FormGroup, Label } from '@instana/components';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import {
  durationUnitOptions,
  recurrenceOptions
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import DateInput from 'in-components/form/DateInput/DateInput';
import { t } from 'in-i18n';

import locals from './ConfigureCorrectionWindowDialog.mless';

export default function StartSection() {
  return (
    <>
      <Column lg={8} md={8}>
        <StartDateSection />
      </Column>
      <Column lg={8} md={8}>
        <FrequencySection />
      </Column>
      <Column lg={1} md={1}>
        <AllDaySection />
      </Column>
      <Column lg={3} md={3}>
        <StartTimeSection />
      </Column>
      <Column lg={5} md={5}>
        <DurationAmountSection />
      </Column>
      <Column lg={4} md={4}>
        <DurationUnitSection />
      </Column>
      <Column lg={3} md={3} />
    </>
  );
}

function FrequencySection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const frequencyField = form.getIn(['schedule', 'frequency']);

  return (
    <Dropdown
      id="correction-window-frequency"
      label=""
      titleText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.frequency')}
      onChange={({ selectedItem }) =>
        onChange(['schedule', 'frequency'], () => frequencyField.setValue(selectedItem!.value).setTouched(true))
      }
      selectedItem={recurrenceOptions.find(({ value }) => value === frequencyField.value)}
      items={recurrenceOptions}
    />
  );
}

function AllDaySection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const allDayField = form.getIn(['schedule', 'start', 'allDay']);

  return (
    <Toggle
      labelA=""
      labelB=""
      size="sm"
      id="correction-window-all-day-toggle"
      labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.allDay')}
      toggled={allDayField.value}
      onToggle={checked =>
        onChange(['schedule', 'start', 'allDay'], () => allDayField.setValue(checked).setTouched(true))
      }
    />
  );
}

function StartTimeSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleField = form.get('schedule');
  const startTimeField = scheduleField.getIn(['start', 'time']);
  const allDayField = scheduleField.getIn(['start', 'allDay']);

  const isStartTimeValid = isFieldValid(startTimeField);

  return (
    <TimePicker
      id="correction-window-start-time"
      labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.startTime')}
      disabled={allDayField.value}
      value={startTimeField.value}
      invalid={!isStartTimeValid}
      invalidText={getValidationMessage(startTimeField)}
      onChange={value => onChange(['schedule', 'start', 'time'], () => startTimeField.setValue(value).setTouched(true))}
    />
  );
}

function DurationAmountSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleField = form.get('schedule');
  const allDayField = scheduleField.getIn(['start', 'allDay']);
  const durationAmountField = scheduleField.getIn(['duration', 'amount']);

  const isDurationAmountFieldValid = isFieldValid(durationAmountField);

  return (
    <NumberInput
      className={cx(locals['inline-flex'], locals['w-100'])}
      disabled={allDayField.value}
      id="correction-window-window-duration"
      label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.windowDuration')}
      min={0}
      invalid={!isDurationAmountFieldValid}
      invalidText={getValidationMessage(durationAmountField)}
      value={durationAmountField.value}
      onChange={(_, { value }) =>
        onChange(['schedule', 'duration', 'amount'], () => durationAmountField.setValue(Number(value)).setTouched(true))
      }
    />
  );
}

function DurationUnitSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleField = form.get('schedule');
  const allDayField = scheduleField.getIn(['start', 'allDay']);
  const durationUnitField = scheduleField.getIn(['duration', 'unit']);

  return (
    <Dropdown
      label=""
      titleText={<wbr />}
      disabled={allDayField.value}
      id="correction-window-window-duration-unit"
      items={durationUnitOptions}
      selectedItem={durationUnitOptions.find(({ value }) => value === durationUnitField.value)}
      onChange={({ selectedItem }) =>
        onChange(['schedule', 'duration', 'unit'], () =>
          durationUnitField.setValue(selectedItem!.value).setTouched(true)
        )
      }
    />
  );
}

function StartDateSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const startDateField = form.getIn(['schedule', 'start', 'date']);

  const isStartDateValid = isFieldValid(startDateField);
  return (
    <FormGroup>
      <Label htmlFor="correction-window-start-date" hasError={!isStartDateValid}>
        {t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.startDate')}
      </Label>
      {/* TODO: error state not passed to date input in ui-foundation  */}
      <DateInput
        id="correction-window-start-date"
        placeholder="YYYY-MM-DD"
        hasError={!isStartDateValid}
        value={startDateField.value}
        onChange={e => {
          if (e) onChange(['schedule', 'start', 'date'], () => startDateField.setValue(e).setTouched(true));
        }}
      />
      <TouchedMessages field={startDateField} />
    </FormGroup>
  );
}
