/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { t } from '@instana/i18n-react';

import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox';

export interface SloTagFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
}

export default function SloTagFilter({ tags, value, onChange }: SloTagFilterProps) {
  useEffect(() => {
    const validTags = tags || [];
    // Filter out tags that aren't in the available tags list
    const filteredTags = validTags.length > 0 ? value.filter(tag => validTags.includes(tag)) : value;
    // Check if the value list contains any tags that are no longer valid
    const isValid = value.length > 0 && (filteredTags.length === 0 || filteredTags.length < value.length);

    if (isValid) {
      // Update the value with only valid tags
      onChange(filteredTags);
    }
  }, [value, tags, onChange]);

  return (
    <ComboBox
      placeholder={t('in-service-levels:sloList.components.sloTagFilter.placeholder')}
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
