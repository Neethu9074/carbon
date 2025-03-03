/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import { CarbonTextInput as TextInput } from '@instana/components';
import { t } from '@instana/i18n-react';

import { role } from 'in-stores/user';

interface SubtraceNameInputProps {
  formField: Field<string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SubtraceNameInput = ({ formField, onChange }: SubtraceNameInputProps) => {
  const value = formField.value;
  const invalid = formField.touched && !formField.valid; // invalid if the field was actually edited
  const invalidText = formField.messages?.[0]?.message;
  return (
    <TextInput
      id="subtraceName"
      labelText={t('in-applications:subtraces.configuration.subtraceName')}
      value={value}
      onChange={onChange}
      disabled={!role?.canConfigureSubtraces}
      invalid={invalid}
      invalidText={invalidText}
    />
  );
};
