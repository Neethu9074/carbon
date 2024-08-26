/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { useState } from 'react';

import { t } from 'in-i18n';

type RetentionPeriodFormFields = 'validation' | 'reason' | 'retentionPeriod';

const localisationStrings = {
  typeValidation: t('in-settings:tabs.retentionPeriod.typeToContinue'),
  reasonValidationMessage: t('in-settings:tabs.retentionPeriod.reasonValidationMessage')
};

const getInitialFormState = () => {
  const form = createMapForm<any>();
  return form
    .put(
      'validation',
      createField({
        value: '',
        validator: value =>
          value === 'CHANGE RETENTION' ? null : [{ severity: 'error', message: localisationStrings.typeValidation }]
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
      'retentionPeriod',
      createField({
        value: '30'
      })
    );
};
export default function useRetentionPeriodForm() {
  const [form, setForm] = useState(getInitialFormState());
  const [sumbmitted, setSubmitted] = useState(false);
  const onChange = (name: RetentionPeriodFormFields, value: string) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };
  const setReasonInputValue = (value: string) => onChange('reason', value);
  const setValidationInputValue = (value: string) => onChange('validation', value);
  const setRetentionPeriodInputValue = (value: string) => onChange('retentionPeriod', value);

  const reasonInputValue = form.get('reason').value;
  const validationInputValue = form.get('validation').value;
  const retentionPeriodInputValue = form.get('retentionPeriod').value;

  const validationValidationMessage =
    form.get('validation').valid || (!form.get('validation').touched && !sumbmitted)
      ? null
      : form.get('validation').messages[0].message;
  const reasonValidationMessage =
    form.get('reason').valid || (!form.get('reason').touched && !sumbmitted)
      ? null
      : form.get('reason').messages[0].message;

  const canSubmit = form.hierarchyValid;
  const resetForm = () => setForm(getInitialFormState);

  return {
    onChange,
    form,
    setSubmitted,
    setReasonInputValue,
    setRetentionPeriodInputValue,
    setValidationInputValue,
    reasonInputValue,
    retentionPeriodInputValue,
    validationInputValue,
    validationValidationMessage,
    reasonValidationMessage,
    canSubmit,
    resetForm
  };
}
