/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Frequency, RRule, Weekday } from 'rrule';

import { CorrectionConfiguration } from '@instana/types';

import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { isFieldValid } from 'in-service-levels/utils/form';
import { parseDate } from 'in-services/formatters/date';

export function formToCorrectionWindow(
  form: CorrectionWindowForm,
  configuration?: CorrectionConfiguration
): CorrectionConfiguration {
  return {
    name: form.get('name').value,
    description: form.get('description').value,
    id: configuration?.id,
    sloIds: form.get('sloIds').value,
    active: configuration?.active ?? true,
    scheduling: {
      duration: form.getIn(['schedule', 'duration', 'amount']).value,
      durationUnit: form.getIn(['schedule', 'duration', 'unit']).value,
      recurrent: form.getIn(['schedule', 'frequency']).value !== ONE_TIME,
      startTime: formToStartTime(form),
      recurrentRule: formToRRule(form)
    },
    tags: []
  };
}

function formToByweekday(form: CorrectionWindowForm) {
  const daysOfTheWeek = form.getIn(['schedule', 'recurrence', 'daysOfTheWeek']).value;
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency === RRule.WEEKLY) return daysOfTheWeek;
  if (frequency === ONE_TIME || frequency === Frequency.DAILY) return null;
  const repeatType = form.getIn(['schedule', 'recurrence', 'repeatType']).value!;
  if (repeatType === 'date') return null;
  const dayInterval = form.getIn(['schedule', 'recurrence', 'dayInterval']).value!;
  return new Weekday(daysOfTheWeek[0], dayInterval);
}

function formToBymonthday(form: CorrectionWindowForm) {
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency !== RRule.MONTHLY && frequency !== RRule.YEARLY) return null;
  const repeatType = form.getIn(['schedule', 'recurrence', 'repeatType']).value!;
  if (repeatType === 'day') return null;
  const date = form.getIn(['schedule', 'recurrence', 'date']).value!;
  return [date];
}

function formToBymonth(form: CorrectionWindowForm) {
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency !== RRule.YEARLY) return null;
  const month = form.getIn(['schedule', 'recurrence', 'month']).value!;
  return [month];
}

function removeZFromRRuleUntil(rruleString: string) {
  // Regular expression to find UNTIL followed by an ISO date-time string
  // and capture the date-time part without the 'Z'.
  //
  // Explanation of the regex:
  // (UNTIL=)          - Matches the literal "UNTIL="
  // (\d{8}T\d{6})     - Captures 8 digits (YYYYMMDD), 'T', and 6 digits (HHMMSS)
  // (Z)               - Captures the literal 'Z'
  // (?=;?|$)          - A positive lookahead: ensures the 'Z' is followed by a ';' or end of string.
  //                     This prevents matching 'Z' in other parts of the string if any,
  //                     and ensures it's the 'Z' associated with the UNTIL value.
  // g                 - Global flag, to find all occurrences (though UNTIL typically appears once)
  //
  const regex = /(UNTIL=\d{8}T\d{6})Z(?=;|$)/g;

  // Replace the 'Z' with an empty string
  const modifiedRRuleString = rruleString.replace(regex, '$1');

  return modifiedRRuleString;
}

function formToRRule(form: CorrectionWindowForm) {
  const frequency = form.getIn(['schedule', 'frequency']).value;
  const interval = form.getIn(['schedule', 'recurrence', 'interval']).value;
  const endDate = form.getIn(['schedule', 'recurrence', 'endDate']).value;
  const occurrences = form.getIn(['schedule', 'recurrence', 'occurrences']).value;
  const repeatUntil = form.getIn(['schedule', 'recurrence', 'repeatUntil']).value;
  const byweekday = formToByweekday(form);
  const bymonthday = formToBymonthday(form);
  const bymonth = formToBymonth(form);

  if (frequency === ONE_TIME) {
    return '';
  }
  const until = repeatUntil === 'date' ? new Date(endDate) : null;
  if (until) until.setUTCHours(0, 0, 0, 0);
  const rRule = new RRule({
    freq: frequency,
    interval: frequency === RRule.YEARLY ? 1 : interval,
    until,
    count: repeatUntil === 'occurrences' ? occurrences : null,
    byweekday,
    bymonthday,
    bymonth
  });

  const rRuleString = rRule.toString();

  // We only use the recurrence part of the RRule and not the date-time start as we store it separately
  const rRuleLine = rRuleString
    .split('\n')
    .find(line => line.startsWith('RRULE:'))
    ?.replace('RRULE:', '');

  return removeZFromRRuleUntil(rRuleLine ?? '');
}

function formToStartTime(form: CorrectionWindowForm) {
  const allDay = form.getIn(['schedule', 'start', 'allDay']).value;
  const time = form.getIn(['schedule', 'start', 'time']).value;
  const date = form.getIn(['schedule', 'start', 'date']).value;
  const parsedDate = parseDate(date);

  if (allDay) {
    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate.getTime();
  }

  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  parsedDate.setHours(hours, minutes, 0, 0);
  return parsedDate.getTime();
}

export function getIsFormValid(form: CorrectionWindowForm) {
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
