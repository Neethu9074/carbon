/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { useState } from 'react';

import { formatDate, formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { t } from 'in-i18n';

type DeleteLogsFormFields = 'validation' | 'reason' | 'deletionEndDate' | 'deletionEndTime';

const localisationStrings = {
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
  untilDateValidationMessage: t('in-settings:tabs.deleteLogs.untilDateValidationMessage'),
  reasonValidationMessage: t('in-settings:tabs.deleteLogs.reasonValidationMessage'),
  untilTimeValidationMessage: t('in-settings:tabs.deleteLogs.untilTimeValidationMessage'),
  correctTimeFormat: t('in-settings:tabs.deleteLogs.correctTimeFormat')
};

const getInitialFormState = () => {
  const form = createMapForm<any>();
  return form
    .put(
      'validation',
      createField({
        value: '',
        validator: value =>
          value === 'LOGS' ? null : [{ severity: 'error', message: localisationStrings.typeValidation }]
      })
    )
    .put(
      'reason',
      createField({
        value: '',
        validator: value =>
          value !== '' ? null : [{ severity: 'error', message: localisationStrings.reasonValidationMessage }]
      })
    )
    .put(
      'deletionEndDate',
      createField({
        value: formatDate(new Date()),
        validator: value => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const inputDate = new Date(value as string);
          inputDate.setHours(0, 0, 0, 0);

          return inputDate <= today
            ? null
            : [{ severity: 'error', message: localisationStrings.untilDateValidationMessage }];
        }
      })
    )
    .put(
      'deletionEndTime',
      createField({
        value: formatTimeWithoutSeconds(new Date()),
        validator: value => {
          const regex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
          if (!regex.test(value as string)) {
            return [{ severity: 'error', message: localisationStrings.correctTimeFormat }];
          }

          return null;
        }
      })
    );
};
export default function useDeleteLogsForm() {
  const [form, setForm] = useState(getInitialFormState());
  const onChange = (name: DeleteLogsFormFields, value: string) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };
  const setReasonInputValue = (value: string) => onChange('reason', value);
  const setDateInputValue = (value: string[]) => onChange('deletionEndDate', value[0]);

  const setValidationInputValue = (value: string) => onChange('validation', value);
  const setTimeInputValue = (value: string) => onChange('deletionEndTime', value);

  const reasonInputValue = form.get('reason').value;
  const dateInputValue = formatDate(form.get('deletionEndDate').value);
  const timeInputValue = form.get('deletionEndTime').value;
  const validationInputValue = form.get('validation').value;

  const validationValidationMessage =
    form.get('validation').valid || !form.get('validation').touched ? null : form.get('validation').messages[0].message;
  const reasonValidationMessage =
    form.get('reason').valid || !form.get('reason').touched ? null : form.get('reason').messages[0].message;
  const dateValidationMessage =
    form.get('deletionEndDate').valid || !form.get('deletionEndDate').touched
      ? null
      : form.get('deletionEndDate').messages[0].message;
  const timeValidationMessage =
    form.get('deletionEndTime').valid || !form.get('deletionEndTime').touched
      ? getValidationTime(dateInputValue as string, timeInputValue as string)
      : form.get('deletionEndTime').messages[0].message;

  const canSubmit = form.hierarchyValid && !timeValidationMessage;
  const resetForm = () => setForm(getInitialFormState());
  const touchForm = () => setForm(form.setTouched(true, { recurse: true }));

  return {
    onChange,
    form,
    setReasonInputValue,
    setDateInputValue,
    setValidationInputValue,
    setTimeInputValue,
    reasonInputValue,
    dateInputValue,
    timeInputValue,
    validationInputValue,
    validationValidationMessage,
    reasonValidationMessage,
    dateValidationMessage,
    timeValidationMessage,
    canSubmit,
    resetForm,
    touchForm
  };
}

function getValidationTime(dateInputValue: string, timeInputValue: string) {
  const selectedDate = new Date(dateInputValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate.getTime() === today.getTime()) {
    const inputTime = createTodayDateWithTime(timeInputValue);
    const now = new Date();

    if (inputTime > now) {
      return localisationStrings.untilTimeValidationMessage;
    }
  }
  return null;
}

function createTodayDateWithTime(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date;
}
