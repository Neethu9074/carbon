/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { useState } from 'react';

import { formatDate, formatTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

type DeleteLogsFormFields = 'validation' | 'reason' | 'deletionEndDate' | 'deletionEndTime';

const localisationStrings = {
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
  untilDateValidationMessage: t('in-settings:tabs.deleteLogs.untilDateValidationMessage'),
  reasonValidationMessage: t('in-settings:tabs.deleteLogs.reasonValidationMessage')
};

const getInitialFormState = () => {
  const form = createMapForm<any>({
    validator: form => {
      const isPastCurrentTime =
        +new Date(String(`${form.deletionEndDate?.value} ${form.deletionEndTime?.value}`)) - +new Date() > 0;
      const areFieldsTouched = form.deletionEndTime?.touched || form.deletionEndDate?.touched;
      return isPastCurrentTime && areFieldsTouched
        ? [{ severity: 'error', message: localisationStrings.untilDateValidationMessage }]
        : null;
    }
  });
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
        value: formatDate(new Date())
      })
    )
    .put(
      'deletionEndTime',
      createField({
        value: formatTime(new Date())
      })
    );
};
export default function useDeleteLogsForm() {
  const [form, setForm] = useState(getInitialFormState());
  const onChange = (name: DeleteLogsFormFields, value: string) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };
  const setReasonInputValue = (value: string) => onChange('reason', value);
  const setDateInputValue = (value: string) => onChange('deletionEndDate', value);

  const setValidationInputValue = (value: string) => onChange('validation', value);
  const setTimeInputValue = (value: string) => onChange('deletionEndTime', value);

  const reasonInputValue = form.get('reason').value;
  const dateInputValue = form.get('deletionEndDate').value;
  const timeInputValue = form.get('deletionEndTime').value;
  const validationInputValue = form.get('validation').value;

  const validationValidationMessage =
    form.get('validation').valid || !form.get('validation').touched ? null : form.get('validation').messages[0].message;
  const reasonValidationMessage =
    form.get('reason').valid || !form.get('reason').touched ? null : form.get('reason').messages[0].message;
  const dateTimeValidationMessage = form.messages[0]?.message;

  const canSubmit = form.hierarchyValid;
  const resetForm = () => setForm(getInitialFormState);
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
    dateTimeValidationMessage,
    canSubmit,
    resetForm,
    touchForm
  };
}
