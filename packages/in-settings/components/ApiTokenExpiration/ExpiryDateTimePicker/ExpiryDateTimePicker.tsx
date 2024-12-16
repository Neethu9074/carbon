/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { FormGroup, Label, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { updateExpiresOnFormField } from 'in-settings/components/ApiTokenExpiration/utils';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import DateInput from 'in-components/form/DateInput/DateInput';
import TimeInput from 'in-components/TimeInput/TimeInput';

export interface ExpiryDateTimePickerProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
}

export default function ExpiryDateTimePicker({ form, setForm }: ExpiryDateTimePickerProps) {
  const dateInput = form.get('customTokenExpiry').get('date').value;
  const timeInput = form.get('customTokenExpiry').get('time').value;

  const onChangeExpirationDateTime = (e: string, inputValue: string) => {
    let dateTime: number;

    if (inputValue === 'date') {
      dateTime = new Date(`${e} ${timeInput}`).getTime();
    } else {
      dateTime = new Date(`${dateInput} ${e}`).getTime();
    }
    let updatedForm = form.updateIn(['customTokenExpiry', inputValue], f =>
      (f as Field<string>).setValue(e as string).setTouched(true)
    );

    if (updatedForm.get('customTokenExpiry')?.hierarchyValid) {
      updatedForm = updateExpiresOnFormField(updatedForm, dateTime);
    }

    setForm(updatedForm);
  };
  return (
    <Stack direction="horizontal" gap="normal">
      {form
        .get('customTokenExpiry')
        ?.get('date')
        .map((field: Field<string>) => (
          <FormGroup>
            <Label
              htmlFor="apiTokenExpiryDate"
              hasError={(!field.valid && field.touched) || !form.get('customTokenExpiry').valid}
            >
              {t('in-settings:tabs.apiTokenExpiryDate')}
            </Label>

            <DateInput
              data-testid="apiTokenExpiryDate"
              placeholder="YYYY-MM-DD"
              hasError={(!field.valid && field.touched) || !form.get('customTokenExpiry').valid}
              value={dateInput}
              onChange={e => onChangeExpirationDateTime(e as string, 'date')}
            />
            <TouchedMessages field={field} />
            <TouchedMessages field={form.get('customTokenExpiry')} />
          </FormGroup>
        ))}
      {form
        .get('customTokenExpiry')
        ?.get('time')
        .map((field: Field<string>) => (
          <FormGroup>
            <Label
              htmlFor="apiTokenExpiryTime"
              hasError={(!field.valid && field.touched) || !form.get('customTokenExpiry').valid}
            >
              {t('in-settings:tabs.apiTokenExpiryTime')}
            </Label>

            <TimeInput
              data-testid="apiTokenExpiryTime"
              // @ts-expect-error ignoring  placeholder props
              placeholder="00:00"
              hasError={(!field.valid && field.touched) || !form.get('customTokenExpiry').valid}
              value={timeInput}
              onChange={e => onChangeExpirationDateTime(e, 'time')}
              fullWidth
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </Stack>
  );
}
