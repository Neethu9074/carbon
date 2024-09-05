/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Field } from 'formalistic';

import { FormGroup, Label, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { FormProp, StateProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import { updateExpiresOnFormField } from 'in-settings/components/ApiTokenExpiration/utils';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import DateInput from 'in-components/form/DateInput/DateInput';
import TimeInput from 'in-components/TimeInput/TimeInput';

export interface ExpiryDateTimePickerProps {
  form: FormProp;
  setState?: Dispatch<SetStateAction<StateProps>>;
}

export default function ExpiryDateTimePicker({ form, setState }: ExpiryDateTimePickerProps) {
  const dateInput = form.get('customTokenExpiry').get('date').value;
  const timeInput = form.get('customTokenExpiry').get('time').value;

  const onChangeExpirationDateTime = (e: string, inputValue: string) => {
    let dateTime: number;

    if (!setState) {
      return;
    }

    if (inputValue === 'date') {
      dateTime = new Date(`${e} ${timeInput}`).getTime();
    } else {
      dateTime = new Date(`${dateInput} ${e}`).getTime();
    }
    let updatedForm = form.updateIn(['customTokenExpiry', inputValue], (f: Field<string>) =>
      (f as Field<string>).setValue(e as string).setTouched(true)
    );

    if (updatedForm.get('customTokenExpiry')?.hierarchyValid) {
      updatedForm = updateExpiresOnFormField(updatedForm, dateTime);
    }

    setState(prevState => ({
      ...prevState,
      form: updatedForm
    }));
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
              // @ts-expect-error ignoring  placeholder props
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
              onChange={e => onChangeExpirationDateTime(e as string, 'time')}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </Stack>
  );
}
