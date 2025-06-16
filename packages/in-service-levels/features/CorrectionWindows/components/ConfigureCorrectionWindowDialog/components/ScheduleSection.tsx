/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import { RRule } from 'rrule';

import { CreateTearsheetStep } from '@instana/ibm-products';
import { Spacer } from '@instana/components';
import { Grid } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import RecurrenceSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/RecurrenceSection';
import MetadataSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/MetadataSection';
import MonthlySection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/MonthlySection';
import WeeklySection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/WeeklySection';
import YearlySection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/YearlySection';
import useValidateForm from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/hooks/useValidateForm';
import StartSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/StartSection';
import DailySection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/DailySection';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { isFieldValid } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

import locals from './ConfigureCorrectionWindowDialog.mless';

function getIsFormValid(form: CorrectionWindowForm) {
  const nameField = form.get('name');
  const scheduleField = form.get('schedule');
  const startDateField = scheduleField.getIn(['start', 'date']);
  const startTimeField = scheduleField.getIn(['start', 'time']);
  const durationAmountField = scheduleField.getIn(['duration', 'amount']);
  const intervalField = scheduleField.getIn(['recurrence', 'interval']);
  const daysOfTheWeekField = scheduleField.getIn(['recurrence', 'daysOfTheWeek']);
  const dayIntervalField = scheduleField.getIn(['recurrence', 'dayInterval']);
  const occurrencesField = scheduleField.getIn(['recurrence', 'occurrences']);
  const endDateField = scheduleField.getIn(['recurrence', 'endDate']);
  const dateField = scheduleField.getIn(['recurrence', 'date']);
  const monthField = scheduleField.getIn(['recurrence', 'month']);

  const isNameValid = isFieldValid(nameField);
  const isStartDateValid = isFieldValid(startDateField);
  const isStartTimeValid = isFieldValid(startTimeField);
  const isDurationAmountFieldValid = isFieldValid(durationAmountField);
  const isIntervalFieldValid = isFieldValid(intervalField);
  const isDaysOfTheWeekFieldValid = isFieldValid(daysOfTheWeekField);
  const isDayIntervalFieldValid = isFieldValid(dayIntervalField);
  const isOccurrencesFieldValid = isFieldValid(occurrencesField);
  const isEndDateFieldValid = isFieldValid(endDateField);
  const isDateFieldValid = isFieldValid(dateField);
  const isMonthFieldValid = isFieldValid(monthField);

  return (
    isNameValid &&
    isStartDateValid &&
    isStartTimeValid &&
    isDurationAmountFieldValid &&
    isIntervalFieldValid &&
    isDaysOfTheWeekFieldValid &&
    isDayIntervalFieldValid &&
    isOccurrencesFieldValid &&
    isEndDateFieldValid &&
    isDateFieldValid &&
    isMonthFieldValid
  );
}

export default function ScheduleSection() {
  const { form } = useContext(CorrectionWindowFormContext);
  const frequencyField = form.getIn(['schedule', 'frequency']);

  const isFormValid = getIsFormValid(form);
  const validateForm = useValidateForm();

  return (
    <CreateTearsheetStep
      hasFieldset={false}
      title={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.title')}
      onNext={validateForm}
      invalid={!isFormValid}
      subtitle={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.subtitle')}
      description={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.stepDescription')}
    >
      <Grid className={locals['schedule-step-grid']}>
        <MetadataSection />
        <StartSection />
        {frequencyField.value === RRule.DAILY && <DailySection />}
        {frequencyField.value === RRule.WEEKLY && <WeeklySection />}
        {frequencyField.value === RRule.MONTHLY && <MonthlySection />}
        {frequencyField.value === RRule.YEARLY && <YearlySection />}
      </Grid>
      {frequencyField.value !== ONE_TIME && (
        <>
          <Spacer vertical="small" />
          <RecurrenceSection />
        </>
      )}
    </CreateTearsheetStep>
  );
}
