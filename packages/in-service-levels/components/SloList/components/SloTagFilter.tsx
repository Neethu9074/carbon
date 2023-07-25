/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox';

export interface SloTagFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
  disabled?: boolean;
}

export default function SloTagFilter({ tags, value, onChange, disabled }: SloTagFilterProps) {
  return (
    <ComboBox
      placeholder={t('in-service-levels:sloList.components.sloTagFilter.placeholder')}
      isDisabled={disabled}
      options={mapTags(tags)}
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

function mapTags(tags?: string[]) {
  if (!tags || !tags.length) {
    return [
      {
        value: '',
        label: t('in-service-levels:sloList.components.sloTagFilter.noTagsInfo'),
        isDisabled: true
      }
    ];
  }

  return tags.map(t => ({ label: t, value: t }));
}
