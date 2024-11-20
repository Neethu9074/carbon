/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TextInput } from '@instana/components';
import { t } from '@instana/i18n-react';

interface SubtraceNameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SubtraceNameInput = ({ value, onChange }: SubtraceNameInputProps) => {
  return (
    <TextInput
      id="subtraceName"
      labelText={t('in-applications:subtraces.configuration.subtraceName')}
      value={value}
      onChange={onChange}
    />
  );
};
