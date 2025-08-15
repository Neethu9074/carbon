/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Frequency, RRule, Weekday } from 'rrule';

import { ONE_TIME, POLICY_CONDITION } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { PolicyForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { NewPolicy, NewTypeConfiguration } from 'in-automation/types';
import { areFieldsValid } from 'in-automation/utils/form';
import { getSingle } from 'in-services/settings/settings';
import { parseDate } from 'in-services/formatters/date';
import { POLICY_TYPE } from 'in-automation/constants';

export function getPolicyFromForm(form: PolicyForm) {
  const policySpecification: NewPolicy = {
    name: form.get('name').value,
    description: form.get('description').value,
    tags: form.get('tags').value,
    trigger: {
      type: form.get('triggerType').value,
      id: form.get('triggerId').value
    },
    typeConfigurations: [] as NewTypeConfiguration[]
  };
  const query = form.get('scope').get('applyOn').value === SCOPE.ALL ? undefined : form.get('scope').get('query').value;
  const isScheduled = form.get('condition').value === POLICY_CONDITION.SCHEDULE;
  const action = form.get('action');
  // const when = action.get('type').get('automatic').value && !isScheduled ? form.get('conditionWhen').value : undefined;

  const typeConfiguration = {
    condition: {
      query
      // when
    },
    runnable: {
      id: action.get('actionId').value,
      type: 'action' as const,
      runConfiguration: {
        actions: [
          {
            action: { id: action.get('actionId').value },
            agentId: action.get('agentId').value,
            inputParameterValues: action.get('parameters').value
          }
        ]
      }
    }
  };

  if (action.get('type').get('manual').value) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.MANUAL,
      ...typeConfiguration
    });
  }

  if (action.get('type').get('automatic').value || isScheduled) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.AUTOMATIC,
      ...typeConfiguration
    });
  }

  if (isScheduled) {
    policySpecification.trigger = {
      ...policySpecification.trigger,
      scheduling: {
        startTime: formToStartTime(form),
        recurrentRule: formToRRule(form)
      }
    };
  }

  return policySpecification;
}

export default function validateFormFields(fieldsToValidate: string[][]) {
  const { form, updateForm } = usePolicyFormContext();

  return () => {
    return new Promise<void>((resolve, reject) => {
      let currentForm = form;
      fieldsToValidate.forEach(fieldPath => {
        currentForm = currentForm.updateIn(fieldPath as any, f => {
          return (f as any).setTouched(true);
        });
      });

      updateForm(currentForm);

      const areAllFieldsValid = areFieldsValid(currentForm, fieldsToValidate);
      if (areAllFieldsValid) {
        resolve();
      } else {
        reject();
      }
    });
  };
}

export function validateScheduleFilds() {
  const { form, updateForm } = usePolicyFormContext();
  return () =>
    new Promise<void>((resolve, reject) => {
      const updatedForm = form.updateIn(['schedule'], schedule => schedule.setTouched(true, { recurse: true }));
      const scheduleField = updatedForm.get('schedule');
      updateForm(updatedForm);
      const disableSubmit = !scheduleField.hierarchyValid && scheduleField.hierarchyTouched;
      if (disableSubmit) reject();
      else resolve();
    });
}

function formToStartTime(form: PolicyForm) {
  const time = form.getIn(['schedule', 'start', 'time']).value;
  const date = form.getIn(['schedule', 'start', 'date']).value;
  const parsedDate = parseDate(date);

  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  parsedDate.setHours(hours, minutes, 0, 0);

  // Check if UTC is enabled in user settings
  const isUtcEnabled = getSingle('formatTimestampsAsUtc');

  if (isUtcEnabled) {
    // If UTC is already enabled, send as is
    return parsedDate.getTime();
  } else {
    // If UTC is not enabled, we need to convert local time to UTC
    // Add the timezone offset to get the correct UTC time
    const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
    const utcTimestamp = parsedDate.getTime() + timezoneOffset;
    return utcTimestamp;
  }
}

function formToRRule(form: PolicyForm) {
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

  // If we have an end date and UTC is not enabled, convert to UTC
  if (until) {
    const isUtcEnabled = getSingle('formatTimestampsAsUtc');

    if (isUtcEnabled) {
      // If UTC is already enabled, just set hours to midnight
      until.setUTCHours(0, 0, 0, 0);
    } else {
      // If UTC is not enabled, convert local date to UTC date
      // First set local time to midnight
      until.setHours(0, 0, 0, 0);
      // Then adjust for timezone offset to get UTC midnight
      const timezoneOffset = until.getTimezoneOffset() * 60000;
      const utcTime = until.getTime() - timezoneOffset;
      until.setTime(utcTime);
    }
  }
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

function formToByweekday(form: PolicyForm) {
  const daysOfTheWeek = form.getIn(['schedule', 'recurrence', 'daysOfTheWeek']).value;
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency === RRule.WEEKLY) return daysOfTheWeek;
  if (frequency === ONE_TIME || frequency === Frequency.DAILY) return null;
  const repeatType = form.getIn(['schedule', 'recurrence', 'repeatType']).value!;
  if (repeatType === 'date') return null;
  const dayInterval = form.getIn(['schedule', 'recurrence', 'dayInterval']).value!;
  return new Weekday(daysOfTheWeek[0], dayInterval);
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

function formToBymonthday(form: PolicyForm) {
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency !== RRule.MONTHLY && frequency !== RRule.YEARLY) return null;
  const repeatType = form.getIn(['schedule', 'recurrence', 'repeatType']).value!;
  if (repeatType === 'day') return null;
  const date = form.getIn(['schedule', 'recurrence', 'date']).value!;
  return [date];
}

function formToBymonth(form: PolicyForm) {
  const frequency = form.getIn(['schedule', 'frequency']).value;
  if (frequency !== RRule.YEARLY) return null;
  const month = form.getIn(['schedule', 'recurrence', 'month']).value!;
  return [month];
}
