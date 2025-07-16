/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm, Field } from 'formalistic';
import { useState } from 'react';

import { t } from 'in-i18n';

type RetentionPeriodFormFields = 'validation' | 'reason' | 'retentionPeriod';

type RetentionFormFields = {
  validation: Field<string>;
  reason: Field<string>;
  retentionPeriod: Field<string>;
};
const localisationStrings = {
  typeValidation: t('in-settings:tabs.retentionPeriod.typeToContinue'),
  reasonValidationMessage: t('in-settings:tabs.retentionPeriod.reasonValidationMessage')
};

const getInitialFormState = () => {
  const form = createMapForm<RetentionFormFields>();
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
          value.trim() !== '' ? null : [{ severity: 'error', message: localisationStrings.reasonValidationMessage }]
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
  const [form, setForm] = useState<MapForm<RetentionFormFields>>(getInitialFormState());
  const [submitted, setSubmitted] = useState(false);

  const onChange = (name: RetentionPeriodFormFields, value: string) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<RetentionFormFields>);
  };

  const fields = {
    reason: form.get('reason'),
    validation: form.get('validation'),
    retentionPeriod: form.get('retentionPeriod')
  };

  const getValidationMessage = (field: Field<string>) => {
    return field.valid || (!field.touched && !submitted) ? null : field.messages[0]?.message ?? null;
  };

  return {
    form,
    onChange,
    setSubmitted,
    resetForm: () => setForm(getInitialFormState()),

    setReasonInputValue: (value: string) => onChange('reason', value),
    setValidationInputValue: (value: string) => onChange('validation', value),
    setRetentionPeriodInputValue: (value: string) => onChange('retentionPeriod', value),

    reasonInputValue: fields.reason.value,
    validationInputValue: fields.validation.value,
    retentionPeriodInputValue: fields.retentionPeriod.value,

    reasonValidationMessage: getValidationMessage(fields.reason),
    validationValidationMessage: getValidationMessage(fields.validation),

    canSubmit: form.hierarchyValid
  };
}
