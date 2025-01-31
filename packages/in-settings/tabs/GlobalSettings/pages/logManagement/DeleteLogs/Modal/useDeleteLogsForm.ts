/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { useState } from 'react';

// eslint-disable-next-line no-restricted-imports
import { returnFirstDeleteableDate } from './mockBackEnd';
// eslint-disable-next-line no-restricted-imports
import { DeleteLogsFormFields } from './modalTypes';
import { formatDate, formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { t } from 'in-i18n';

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
      'deletionStartDate',
      createField({
        value: formatDate(returnFirstDeleteableDate()),
        validator: value => {
          const inputDate = new Date(value as string);
          inputDate.setHours(0, 0, 0, 0);

          return inputDate >= returnFirstDeleteableDate()
            ? null
            : [{ severity: 'error', message: ' The date cant be prior to first log deleteable' }];
        }
      })
    )
    .put(
      'deletionStartTime',
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

  const updateField = (name: DeleteLogsFormFields, value: string) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };

  const setInputValues = {
    reason: (value: string) => updateField('reason', value),
    startDate: (value: string[]) => updateField('deletionStartDate', value[0]),
    endDate: (value: string[]) => updateField('deletionEndDate', value[0]),
    validation: (value: string) => updateField('validation', value),
    startTime: (value: string) => updateField('deletionStartTime', value),
    endTime: (value: string) => updateField('deletionEndTime', value)
  };

  const getFieldValue = (name: DeleteLogsFormFields) => form.get(name).value;

  const inputValues = {
    reason: getFieldValue('reason'),
    startDate: formatDate(getFieldValue('deletionStartDate')),
    endDate: formatDate(getFieldValue('deletionEndDate')),
    startTime: getFieldValue('deletionStartTime'),
    endTime: getFieldValue('deletionEndTime'),
    validation: getFieldValue('validation')
  };

  const getValidationMessage = (
    field: DeleteLogsFormFields,
    additionalValidation?: (value: string) => string | null
  ) => {
    const fieldData = form.get(field);
    if (fieldData.valid || !fieldData.touched) return additionalValidation?.(fieldData.value) || null;
    return fieldData.messages[0]?.message;
  };

  const validationMessages = {
    reason: getValidationMessage('reason'),
    startDate: getValidationMessage('deletionStartDate'),
    endDate: getValidationMessage('deletionEndDate'),
    startTime: getValidationMessage('deletionStartTime', _ =>
      getValidationTime(inputValues.startDate as string, inputValues.startTime as string)
    ),
    endTime: getValidationMessage('deletionEndTime', _ =>
      getValidationTime(inputValues.endDate as string, inputValues.endTime as string)
    ),
    validation: getValidationMessage('validation')
  };

  const canSubmit = form.hierarchyValid && !validationMessages.startTime && !validationMessages.endTime;
  const canGoNextStep =
    !validationMessages.startTime &&
    !validationMessages.endTime &&
    !validationMessages.endDate &&
    !validationMessages.startDate;

  const resetForm = () => setForm(getInitialFormState());
  const touchForm = () => setForm(form.setTouched(true, { recurse: true }));

  return {
    setInputValues,
    inputValues,
    validationMessages,
    canSubmit,
    resetForm,
    touchForm,
    canGoNextStep
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
