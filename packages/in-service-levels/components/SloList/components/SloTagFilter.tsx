/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
  disabled?: boolean;
}

export default function SloTagFilter({ tags, value, onChange, disabled }: Props) {
  return (
    <ComboBox
      placeholder={t('in-service-levels:sloList.components.sloTagFilter.placeholder')}
      isDisabled={disabled || !tags?.length}
      options={tags?.map(t => ({ label: t, value: t })) ?? []}
      value={value}
      onChange={newValue => {
        if (!newValue) {
          onChange([]);
        } else if (hasMultipleValuesSelected(newValue)) {
          onChange(newValue.map(option => option.value));
        } else {
          onChange([newValue.value]);
        }
      }}
      isMulti
    />
  );
}
